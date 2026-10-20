#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

interface Vendored {
	ref: string;
	from?: string;
}

interface Manifest {
	repo: string;
	branch: string;
	path: string;
	vendored: Record<string, Vendored>;
	skipped: Record<string, string>;
}

const manifestFile = fileURLToPath(new URL('upstream.json', import.meta.url));
const cache = fileURLToPath(new URL('../../node_modules/.cache/shadcn-vue', import.meta.url));
const manifest: Manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const head = `origin/${manifest.branch}`;

function git(...args: string[]) {
	return execFileSync('git', ['-C', cache, ...args], { encoding: 'utf8' }).trim();
}

function fetchUpstream() {
	if (!existsSync(cache)) {
		execFileSync('git', ['clone', '--quiet', '--filter=blob:none', '--no-checkout', '--single-branch', '--branch', manifest.branch, manifest.repo, cache], { stdio: 'inherit' });
		return;
	}
	git('fetch', '--quiet', '--filter=blob:none', 'origin', manifest.branch);
}

function upstreamPath(name: string) {
	return `${manifest.path}/${manifest.vendored[name]?.from ?? name}`;
}

function upstreamComponents() {
	return git('ls-tree', '-d', '--name-only', head, `${manifest.path}/`)
		.split('\n')
		.map(path => path.slice(manifest.path.length + 1));
}

function commitsSince(name: string) {
	const { ref } = manifest.vendored[name]!;
	const log = git('log', '--format=%h %cs %s', `${ref}..${head}`, '--', upstreamPath(name));
	return log ? log.split('\n') : [];
}

function trackedNames(names: string[]) {
	const unknown = names.filter(name => !manifest.vendored[name]);
	if (unknown.length > 0)
		fail(`Not vendored: ${unknown.join(', ')}. Run "upstream track <name>" first.`);
	return names.length > 0 ? names : Object.keys(manifest.vendored);
}

function save() {
	writeFileSync(manifestFile, `${JSON.stringify(manifest, null, '\t')}\n`);
}

function fail(message: string): never {
	process.stderr.write(`${message}\n`);
	process.exit(1);
}

function status() {
	const upstream = upstreamComponents();
	const taken = new Set(Object.keys(manifest.vendored).map(name => manifest.vendored[name]!.from ?? name));

	const changed = Object.keys(manifest.vendored)
		.filter(name => upstream.includes(manifest.vendored[name]!.from ?? name))
		.map(name => ({ name, commits: commitsSince(name) }))
		.filter(({ commits }) => commits.length > 0);
	const removed = Object.keys(manifest.vendored).filter(name => !upstream.includes(manifest.vendored[name]!.from ?? name));
	const added = upstream.filter(name => !taken.has(name) && !(name in manifest.skipped));

	process.stdout.write(`shadcn-vue ${git('log', '-1', '--format=%h %cs', head)}\n`);
	process.stdout.write(`\nChanged upstream (${changed.length}):\n`);
	for (const { name, commits } of changed) {
		process.stdout.write(`  ${name}\n`);
		for (const commit of commits)
			process.stdout.write(`    ${commit}\n`);
	}
	process.stdout.write(`\nNew upstream (${added.length}):\n${added.map(name => `  ${name}\n`).join('')}`);
	if (removed.length > 0)
		process.stdout.write(`\nGone upstream (${removed.length}):\n${removed.map(name => `  ${name}\n`).join('')}`);
}

function diff(names: string[]) {
	for (const name of trackedNames(names)) {
		spawnSync('git', ['-C', cache, '--no-pager', 'diff', '--color=auto', `${manifest.vendored[name]!.ref}..${head}`, '--', upstreamPath(name)], { stdio: 'inherit' });
	}
}

function show(name: string) {
	const path = `${manifest.path}/${name}`;
	for (const file of git('ls-tree', '-r', '--name-only', head, `${path}/`).split('\n').filter(Boolean)) {
		process.stdout.write(`==> ${file.slice(path.length + 1)}\n${git('show', `${head}:${file}`)}\n\n`);
	}
}

function synced(names: string[]) {
	const ref = git('rev-parse', '--short', head);
	for (const name of trackedNames(names))
		manifest.vendored[name]!.ref = ref;
	save();
}

function track(name: string, from?: string) {
	if (!upstreamComponents().includes(from ?? name))
		fail(`No upstream component ${from ?? name}`);
	manifest.vendored[name] = { ref: git('rev-parse', '--short', head), ...(from && { from }) };
	delete manifest.skipped[from ?? name];
	save();
}

function skip(name: string, reason: string) {
	if (!reason)
		fail('Give a reason: upstream skip <name> <reason>');
	manifest.skipped[name] = reason;
	save();
}

const usage = `Usage: pnpm upstream [command]

  status                  upstream changes since the last sync, and new components (default)
  diff [name...]          upstream diff since the last sync
  show <name>             upstream files of a component
  synced [name...]        mark components synced with the current upstream
  track <name> [from]     start vendoring a component, from an upstream name when it differs
  skip <name> <reason>    stop listing an upstream component as new
`;

const [command = 'status', ...args] = process.argv.slice(2);

switch (command) {
	case 'status':
		fetchUpstream();
		status();
		break;
	case 'diff':
		fetchUpstream();
		diff(args);
		break;
	case 'show':
		fetchUpstream();
		show(args[0] ?? fail(usage));
		break;
	case 'synced':
		fetchUpstream();
		synced(args);
		break;
	case 'track':
		fetchUpstream();
		track(args[0] ?? fail(usage), args[1]);
		break;
	case 'skip':
		skip(args[0] ?? fail(usage), args.slice(1).join(' '));
		break;
	default:
		process.stdout.write(usage);
}
