import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { cancel, confirm, isCancel, select } from '@clack/prompts';
import { versionBump } from 'bumpp';

const FIELD_SEP = '\x1F';
const RECORD_SEP = '\x1E';
const CHANGELOG_PATH = 'CHANGELOG.md';
const CHANGELOG_HEADER = '# Changelog\n\n';
const RELEASE_COMMIT_PATTERN = '^chore: release';

interface Commit {
  sha: string;
  subject: string;
  body: string;
}

function run(command: string): string {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function tryRun(command: string): string {
  try {
    return run(command);
  }
  catch {
    return '';
  }
}

function resolvePreviousTag(): string {
  return tryRun('git describe --tags --abbrev=0 --match "v[0-9]*.[0-9]*.[0-9]*"');
}

function resolveCommitRange(previousTag: string): string {
  return previousTag ? `${previousTag}..HEAD` : 'HEAD';
}

function resolveWebUrl(): string {
  const remote = run('git config --get remote.origin.url');
  return remote
    .replace(/^ssh:\/\/git@([^:/]+)(?::\d+)?\//, 'https://$1/')
    .replace(/^git@([^:]+):/, 'https://$1/')
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
}

function collectCommits(range: string): Commit[] {
  const format = `%H${FIELD_SEP}%s${FIELD_SEP}%b${RECORD_SEP}`;
  const raw = run(
    `git log ${range} --no-merges --invert-grep --grep="${RELEASE_COMMIT_PATTERN}" --pretty=format:"${format}"`,
  );

  return raw
    .split(RECORD_SEP)
    .map(record => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [sha, subject, body = ''] = record.split(FIELD_SEP);
      return { sha, subject: subject.trim(), body };
    });
}

function isTrailerLine(line: string): boolean {
  return /^[A-Z-]+:\s/i.test(line);
}

function formatDescription(body: string): string {
  return body
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !isTrailerLine(line))
    .join('\n');
}

function formatCommit(commit: Commit, webUrl: string): string {
  const shortSha = commit.sha.slice(0, 8);
  const heading = `- ${commit.subject} [\`${shortSha}\`](${webUrl}/commit/${commit.sha})`;
  const description = formatDescription(commit.body);
  if (!description)
    return heading;
  const indented = description
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n\n');
  return `${heading}\n\n${indented}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildSection(version: string, commits: Commit[], webUrl: string): string {
  const entries = commits.map(commit => formatCommit(commit, webUrl)).join('\n\n');
  return `## v${version} (${today()})\n\n${entries}\n`;
}

function readExistingBody(): string {
  if (!existsSync(CHANGELOG_PATH))
    return '';
  return readFileSync(CHANGELOG_PATH, 'utf8').replace(/^# Changelog\n+/, '');
}

function writeChangelog(section: string): void {
  writeFileSync(CHANGELOG_PATH, `${CHANGELOG_HEADER + section}\n${readExistingBody()}`);
}

function stageChangelog(): void {
  run(`git add ${CHANGELOG_PATH}`);
}

function generateChangelog(version: string): void {
  const previousTag = resolvePreviousTag();
  const range = resolveCommitRange(previousTag);
  const webUrl = resolveWebUrl();
  const commits = collectCommits(range);

  writeChangelog(buildSection(version, commits, webUrl));
  stageChangelog();

  console.log(`Changelog updated for v${version} (${commits.length} entries).`);
}

function abort(): never {
  cancel('Release cancelled.');
  process.exit(0);
}

function readCurrentVersion(): string {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
  return pkg.version;
}

function bumpVersion(current: string, kind: 'major' | 'minor' | 'patch'): string {
  const [major, minor, patch] = current.split('.').map(Number);
  if (kind === 'major')
    return `${major + 1}.0.0`;
  if (kind === 'minor')
    return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

async function pickVersion(): Promise<string> {
  const current = readCurrentVersion();
  const selected = await select({
    message: `Select release version (current ${current})`,
    options: [
      { value: bumpVersion(current, 'patch'), label: `patch → ${bumpVersion(current, 'patch')}` },
      { value: bumpVersion(current, 'minor'), label: `minor → ${bumpVersion(current, 'minor')}` },
      { value: bumpVersion(current, 'major'), label: `major → ${bumpVersion(current, 'major')}` },
    ],
  });

  if (isCancel(selected))
    abort();
  return selected;
}

async function confirmRelease(version: string): Promise<void> {
  const proceed = await confirm({
    message: `Bump to v${version}, update changelog, tag and push?`,
  });
  if (isCancel(proceed) || !proceed)
    abort();
}

async function release(): Promise<void> {
  const version = await pickVersion();
  await confirmRelease(version);

  await versionBump({
    release: version,
    all: true,
    commit: true,
    tag: true,
    push: true,
    confirm: false,
    execute: operation => generateChangelog(operation.state.newVersion),
  });
}

release();
