#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { validateThemeCss } from './theme-validator';

const args = process.argv.slice(2);
const separator = args.indexOf('--');
const options = separator === -1 ? args : args.slice(0, separator);

if (options.includes('--help') || options.includes('-h')) {
  process.stdout.write('Usage: shonk-ui-validate-themes [file.css ...]\n\nWith no files, validates the packaged default theme and all presets.\n');
}
else if (options.some(argument => argument.startsWith('-'))) {
  process.stderr.write('Unknown option. Use --help for usage.\n');
  process.exitCode = 1;
}
else {
  const styles = new URL('../src/styles/', import.meta.url);
  const files = separator === -1 ? args : [...options, ...args.slice(separator + 1)];
  if (!files.length) {
    files.push(fileURLToPath(new URL('theme.css', styles)));
    files.push(...readdirSync(new URL('themes/', styles)).filter(name => name.endsWith('.css')).sort().map(name => fileURLToPath(new URL(`themes/${name}`, styles))));
  }

  for (const file of files) {
    try {
      const result = validateThemeCss(readFileSync(file, 'utf8'), { file });
      for (const diagnostic of result.diagnostics) {
        const location = diagnostic.line ? `:${diagnostic.line}:${diagnostic.column}` : '';
        const scope = diagnostic.theme ? ` [${diagnostic.theme}, ${diagnostic.scope}]` : '';
        process.stderr.write(`${file}${location}${scope}: ${diagnostic.message}\n`);
      }
      if (result.valid)
        process.stdout.write(`${file}: valid (${result.themes.join(', ')})\n`);
      else
        process.exitCode = 1;
    }
    catch (error) {
      process.stderr.write(`${file}: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    }
  }
}
