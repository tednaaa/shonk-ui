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
<html data-theme="nocturne">
```

Shipped presets:

- `atlas` — white day, deep neutral night, one blue; the default
- `graphite` — near-neutral greys, one confident blue
- `nocturne` — navy surfaces on both sides, cool saturated accents
- `orchid` — lavender-tinted neutrals, violet primary

Every preset carries a light side and a dark side, so the attribute and the `dark` class are independent:

```html
<html class="dark" data-theme="nocturne">
```

Change the attribute at runtime and everything repaints. Put it on any element instead of `<html>` to theme one subtree.

### Build your own

Set the variables yourself, scoped to an attribute of your own so the default stays intact:

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

`src/styles/theme.css` lists every variable a theme sets. One left out is inherited from a default it was not designed against, so set them all.

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

createApp(App)
  .use(shonkUI, { locale: ru })
  .mount('#app');
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
