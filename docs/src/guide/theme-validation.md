# Theme validation

Requires Node.js 20 or newer.

```bash
pnpm exec shonk-ui-validate-themes ./my-theme.css
```

- Accepts one or more standalone CSS files.
- With no paths, checks the packaged default and all presets.
- Requires every palette variable in light, dark-on-the-theme-element, and dark-on-an-ancestor scopes.
- Reports missing scopes, missing or empty variables, reset keywords, unresolved references, and cycles.
- Returns exit code `1` when a file fails validation or cannot be read.

## Supported CSS

Validation supports `:root` / `.dark` themes and the named-theme selectors from [Themes](./themes#your-own-theme). Grouped selectors, comments, helper variables, nested color functions, `var()` fallbacks, and `!important` are supported.

Keep theme definitions at the top level; imports, conditional rules, nesting, and escaped identifiers are unsupported and produce diagnostics.

::: info
This checks variable definitions and references, not CSS colour validity, contrast, or browser rendering.
:::

## Node API

`validateThemeCss` returns structured diagnostics without printing or setting an exit code:

```ts
import { readFileSync } from 'node:fs';
import { validateThemeCss } from 'shonk-ui/theme-validator';

const result = validateThemeCss(readFileSync('./my-theme.css', 'utf8'), {
	file: 'my-theme.css',
});

if (!result.valid) {
	for (const diagnostic of result.diagnostics) {
		process.stderr.write(`${diagnostic.file}: ${diagnostic.message}\n`);
	}
}
```
