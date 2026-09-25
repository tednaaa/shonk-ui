import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { validateThemeCss } from './theme-validator';

const styles = new URL('../src/styles/', import.meta.url);
const preset = readFileSync(new URL('themes/atlas.css', styles), 'utf8');
const darkStart = preset.indexOf('.dark ');
const light = preset.slice(0, darkStart);
const dark = preset.slice(darkStart);

describe('theme validation', () => {
  it('accepts the default theme and every shipped preset', () => {
    const files = ['theme.css', ...readdirSync(new URL('themes/', styles)).filter(name => name.endsWith('.css')).map(name => `themes/${name}`)];
    for (const file of files) {
      const result = validateThemeCss(readFileSync(new URL(file, styles), 'utf8'), { file });
      expect(result.diagnostics, file).toEqual([]);
      expect(result.valid).toBe(true);
    }
  });

  it('identifies a missing light palette variable and its source scope', () => {
    const result = validateThemeCss(preset.replace(/--primary: [^;]+;/, ''), { file: 'custom.css' });
    expect(result.valid).toBe(false);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: 'missing-variable',
      file: 'custom.css',
      theme: 'atlas',
      mode: 'light',
      scope: 'light',
      variable: '--primary',
      selector: '[data-theme="atlas"]',
      line: 1,
      column: 1,
    }));
  });

  it('requires explicit dark variables even when light and default values exist', () => {
    const result = validateThemeCss(light + dark.replace(/--primary: [^;]+;/, ''));
    expect(result.diagnostics.filter(diagnostic => diagnostic.code === 'missing-variable')).toEqual([
      expect.objectContaining({ variable: '--primary', scope: 'dark-self' }),
      expect.objectContaining({ variable: '--primary', scope: 'dark-ancestor' }),
    ]);
  });

  it.each([
    [light, ['dark-self', 'dark-ancestor']],
    [dark, ['light']],
    [preset.replace('.dark [data-theme="atlas"],', ''), ['dark-ancestor']],
    [preset.replace('.dark[data-theme="atlas"]', '.other'), ['dark-self']],
  ])('detects missing theme scopes', (css, scopes) => {
    const result = validateThemeCss(css);
    expect(result.diagnostics.filter(diagnostic => diagnostic.code === 'missing-scope').map(diagnostic => diagnostic.scope)).toEqual(scopes);
  });

  it('validates multiple named themes independently', () => {
    const result = validateThemeCss(preset + preset.replaceAll('atlas', 'custom').replace(/--ring: [^;]+;/, ''));
    expect(result.themes).toEqual(['atlas', 'custom']);
    expect(result.diagnostics.every(diagnostic => diagnostic.theme === 'custom')).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('accepts reordered rules and split declarations', () => {
    const css = `${dark}${light.replace(/--primary: [^;]+;/, '')}\n[data-theme="atlas"] { --primary: rebeccapurple; }`;
    expect(validateThemeCss(css).diagnostics).toEqual([]);
  });

  it('accepts single-quoted and unquoted theme names and reversed same-element selectors', () => {
    const css = preset.replaceAll('"atlas"', '\'atlas\'').replace('.dark[data-theme=\'atlas\']', '[data-theme=atlas].dark');
    expect(validateThemeCss(css).diagnostics).toEqual([]);
  });

  it('accepts comments and punctuation inside strings', () => {
    const css = `${preset}\n[data-theme="atlas"] { --label: "/* ; { } var(--missing) */"; /* var(--missing) */ }`;
    expect(validateThemeCss(css).diagnostics).toEqual([]);
  });

  it('accepts helpers, nested fallbacks and optional shared-token overrides', () => {
    const css = `${preset}
      [data-theme="atlas"] {
        --helper: var(--absent, var(--also-absent, oklch(0.5 0.1 100)));
        --field: color-mix(in oklab, var(--helper) 40%, var(--primary));
        --radius: 1rem;
      }`;
    expect(validateThemeCss(css).diagnostics).toEqual([]);
  });

  it('does not require optional derived tokens or radius in custom palettes', () => {
    expect(preset).not.toContain('--field:');
    expect(preset).not.toContain('--radius:');
    expect(validateThemeCss(preset).valid).toBe(true);
  });

  it.each(['', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'])('rejects unusable explicit values: %s', (value) => {
    const result = validateThemeCss(`${preset}\n[data-theme="atlas"] { --primary: ${value}; }`);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'invalid-value', variable: '--primary', mode: 'light' }));
  });

  it('reports unresolved references without treating strings as variables', () => {
    const result = validateThemeCss(`${preset}\n[data-theme="atlas"] { --primary: color-mix(in oklab, var(--typo) 50%, red); }`);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'unresolved-reference', variable: '--primary', line: 88 }));
    expect(result.diagnostics.some(diagnostic => diagnostic.message.includes('--typo'))).toBe(true);
  });

  it.each([
    '--helper: var(--helper, red);',
    '--first: var(--second); --second: var(--first);',
    '--first: var(--primary, var(--second)); --second: var(--first);',
  ])('detects cycles, including fallback edges', (declarations) => {
    const result = validateThemeCss(`${preset}\n[data-theme="atlas"] { ${declarations} }`);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'cycle', theme: 'atlas' }));
  });

  it('respects specificity, order and important declarations', () => {
    const css = `${preset}
      .dark[data-theme="atlas"] { --field: red; }
      [data-theme="atlas"] { --field: var(--missing); --field: blue !important; }
      [data-theme="atlas"] { --field: var(--missing-again); }`;
    expect(validateThemeCss(css).diagnostics).toEqual([]);
  });

  it('uses dark derived-token dependencies when dark is on the theme element', () => {
    const css = `${preset}\n.dark[data-theme="atlas"] { --muted: var(--button-secondary); }`;
    const result = validateThemeCss(css);
    expect(result.diagnostics.filter(diagnostic => diagnostic.code === 'cycle')).toEqual([
      expect.objectContaining({ scope: 'dark-self', message: expect.stringContaining('--button-secondary') }),
    ]);
  });

  it.each([
    ['[data-theme="atlas"] { --primary: red;', 'Missing "}"'],
    ['/* comment', 'Unterminated CSS comment'],
    ['[data-theme="atlas"] { --label: "oops; }', 'Unterminated CSS string'],
    ['[data-theme="atlas"] { --primary: oklch(1 0 0; }', 'Unexpected "}"'],
    ['[data-theme="atlas"] { --primary: var(primary); }', 'var() requires'],
    ['[data-theme="atlas"] { --primary red; }', 'Expected a CSS declaration'],
  ])('reports malformed CSS', (css, message) => {
    const result = validateThemeCss(css);
    expect(result.valid).toBe(false);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'syntax', message: expect.stringContaining(message), line: expect.any(Number) }));
  });

  it.each([
    `@media (prefers-color-scheme: dark) { ${preset} }`,
    `@layer themes { ${preset} }`,
    `.wrapper { ${preset} }`,
    `${preset} .unknown { --primary: red; }`,
    `${preset} @import "other.css";`,
    preset.replaceAll('atlas', 'at\\6cas'),
  ])('rejects unsupported theme structures instead of passing silently', (css) => {
    expect(validateThemeCss(css).diagnostics).toContainEqual(expect.objectContaining({ code: 'unsupported' }));
  });

  it('rejects empty CSS', () => {
    expect(validateThemeCss('').diagnostics).toEqual([expect.objectContaining({ code: 'missing-scope' })]);
  });
});

describe('published CLI', () => {
  const directory = mkdtempSync(join(tmpdir(), 'shonk-theme-validator-'));
  const cli = fileURLToPath(new URL('../dist/validate-themes.js', import.meta.url));
  const valid = join(directory, 'valid theme.css');
  const invalid = join(directory, 'invalid.css');
  const malformed = join(directory, 'malformed.css');
  writeFileSync(valid, preset);
  writeFileSync(invalid, light);
  writeFileSync(malformed, '[data-theme="broken"] {');
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  function run(...args: string[]) {
    return spawnSync(process.execPath, [cli, ...args], { cwd: directory, encoding: 'utf8' });
  }

  it('validates packaged themes from an unrelated working directory', () => {
    const result = run();
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.match(/: valid/g)).toHaveLength(5);
    expect(result.stderr).toBe('');
  });

  it('accepts a custom file with spaces in its path', () => {
    const result = run(valid);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('valid (atlas)');
  });

  it('continues across failing files and exits nonzero', () => {
    const result = run(invalid, 'missing.css', malformed, valid);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('valid (atlas)');
    expect(result.stderr).toContain('dark-self');
    expect(result.stderr).toContain('missing.css');
    expect(result.stderr).toContain('Missing "}"');
  });

  it('prints help and rejects unknown options', () => {
    expect(run('--help').stdout).toContain('Usage: shonk-ui-validate-themes');
    expect(run('--help').status).toBe(0);
    expect(run('--unknown').status).toBe(1);
  });

  it('supports the end-of-options separator', () => {
    writeFileSync(join(directory, '--help'), preset);
    const result = run('--', '--help');
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('valid (atlas)');
  });
});
