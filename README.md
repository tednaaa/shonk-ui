# shonk-ui

Shonk UI — Vue 3 + Reka UI + Tailwind CSS v4.

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
