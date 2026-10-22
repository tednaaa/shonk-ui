# Getting started

## Install

```bash
pnpm add shonk-ui
```

Published to the public npm registry.

## Set up styles

In your main CSS file:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shonk-ui";

@custom-variant dark (&:where(.dark, .dark *));
```

## Use a component

```vue
<script setup lang="ts">
import { Button } from 'shonk-ui';
</script>

<template>
	<Button>Click me</Button>
</template>
```

## Next

- [Themes](./themes) — presets, your own palette, dark mode
- [Localization](./localization) — component text in your language
