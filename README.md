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
@theme {
  --color-primary: oklch(0.5 0.2 250);
}

:root {
  --radius: 0.5rem;
}

.dark {
  --color-primary: oklch(0.6 0.2 250);
}
```

Dark mode is toggled via the `.dark` class on a parent element.
