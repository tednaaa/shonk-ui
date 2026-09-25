# shonk-ui

Shonk UI — Vue 3 + Reka UI + Tailwind CSS v4.

## Release

### Install relkit and run it

```fish
cargo install relkit
relkit
```

## Install

```bash
pnpm add shonk-ui
```

Published to the public npm registry.

## Setup

- In your main.css file:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shonk-ui";

@custom-variant dark (&:where(.dark, .dark *));
```

## Themes

Every colour is a CSS variable, so a theme is a set of values and nothing else. Three ways to get one.

### Take the default

`@import "shonk-ui"` already carries it — Atlas, on `:root` and `.dark`. Nothing to import, nothing to set.

### Pick a preset

```css
@import "shonk-ui";
@import "shonk-ui/themes/nocturne.css";
```

```html
<html data-theme="nocturne"></html>
```

Shipped presets:

- `atlas` — white day, deep neutral night, one blue; the default
- `graphite` — near-neutral greys, one confident blue
- `nocturne` — navy surfaces on both sides, cool saturated accents
- `orchid` — lavender-tinted neutrals, violet primary

Every preset carries a light side and a dark side, so the attribute and the `dark` class are independent:

```html
<html class="dark" data-theme="nocturne"></html>
```

Change the attribute at runtime and everything repaints. Put it on any element instead of `<html>` to theme one subtree.

### Build your own

Copy a preset from `src/styles/themes/atlas.css:1`, rename its `data-theme` value, and edit its palette.
Keep every palette variable in both modes and both dark selectors.

An abbreviated example:

```css
[data-theme="mine"] {
  color-scheme: light;

  --background: oklch(1 0 0);
  --foreground: oklch(0.2542 0.0111 254.04);
  --primary: oklch(0.5399 0.1906 257.48);
}

.dark [data-theme="mine"],
.dark[data-theme="mine"] {
  color-scheme: dark;

  --background: oklch(0.2175 0.0042 264.48);
  --foreground: oklch(0.9094 0.0058 264.53);
  --primary: oklch(0.5542 0.1906 262.18);
}
```

The example omits most palette variables; use the complete preset as your starting point.
Shared component tokens such as `--field` and `--button-ghost-accent` derive from your palette automatically.
Those tokens and `--radius` are optional overrides.

### Validate a theme

Requires Node.js 20 or newer.

```bash
pnpm exec shonk-ui-validate-themes ./my-theme.css
```

- Accepts one or more standalone CSS files.
- With no paths, checks the packaged default and all presets.
- Requires every palette variable in light, dark-on-the-theme-element, and dark-on-an-ancestor scopes.
- Reports missing scopes, missing or empty variables, reset keywords, unresolved references, and cycles.
- Returns exit code `1` when a file fails validation or cannot be read.

Validation supports `:root` / `.dark` themes and the named-theme selectors shown above.
Grouped selectors, comments, helper variables, nested color functions, `var()` fallbacks, and `!important` are supported.
Keep theme definitions at the top level; imports, conditional rules, nesting, and escaped identifiers are unsupported and produce diagnostics.

> This checks variable definitions and references, not CSS color validity, contrast, or browser rendering.

The Node API returns structured diagnostics without printing or setting an exit code:

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

For development in this repository:

```bash
pnpm build
pnpm validate:themes
```

## Usage

```vue
<script setup lang="ts">
import { Button } from 'shonk-ui';
</script>

<template>
  <Button>Click me</Button>
</template>
```

## Localization

Text baked into components — the confirm dialog, pagination, close buttons — comes from a locale
you set once:

```ts
import { ru, shonkUI } from 'shonk-ui';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(shonkUI, { locale: ru }).mount('#app');
```

`en` and `ru` ship with the library. Any object of the same shape works, and a partial one falls
back to `en` key by key:

```ts
app.use(shonkUI, {
  locale: {
    intlLocale: 'de-DE',
    confirmDialog: { title: 'Bestätigen', cancelButtonText: 'Abbrechen' },
  },
});
```

`intlLocale` is a BCP-47 tag — Calendar and the date pickers format month and weekday names with it.

Pass a ref or getter to follow a language switcher without a reload:

```ts
app.use(shonkUI, { locale: computed(() => (lang.value === 'ru' ? ru : en)) });
```

Every string also has a prop, for one-off overrides:

```vue
<PaginationNext button-text="Далее" />

<ConfirmDialog title="Внимание" cancel-button-text="Отмена" />
```

And `require()` overrides a single confirm dialog:

```ts
useConfirm().require({
  title: 'Удаление',
  message: 'Удалить продукт?',
  acceptButtonText: 'Удалить',
  cancelButtonText: 'Отмена',
  accept: () => deleteProduct(),
});
```

Skip the plugin and everything stays English.

## Theming

Override theme tokens after the import:

```css
:root {
  --primary: oklch(0.5 0.2 250);
  --radius: 0.5rem;
}

.dark {
  --primary: oklch(0.6 0.2 250);
}
```

Dark mode is toggled via the `.dark` class on a parent element.
