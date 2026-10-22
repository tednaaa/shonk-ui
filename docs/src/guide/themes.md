# Themes

Every colour is a CSS variable, so a theme is a set of values and nothing else.

## Default

`@import "shonk-ui"` already carries Atlas, on `:root` and `.dark`. Nothing to import, nothing to set.

## Presets

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

Change the attribute at runtime and everything repaints. Put it on any element instead of `<html>` to theme one subtree.

## Dark mode

The `.dark` class on a parent element turns dark mode on. Every preset carries a light and a dark side, so the class and the attribute are independent:

```html
<html class="dark" data-theme="nocturne"></html>
```

## Override tokens

Set tokens after the import:

```css
:root {
  --primary: oklch(0.5 0.2 250);
  --radius: 0.5rem;
}

.dark {
  --primary: oklch(0.6 0.2 250);
}
```

## Your own theme

Copy a preset from [`src/styles/themes/atlas.css`](https://github.com/tednaaa/shonk-ui/blob/main/src/styles/themes/atlas.css), rename its `data-theme` value, and edit its palette. Keep every palette variable in both modes and both dark selectors.

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

The example omits most palette variables; start from the complete preset. Component tokens such as `--field` and `--button-ghost-accent` derive from the palette. They and `--radius` are optional overrides.

> [!NOTE]
> [Validate the theme](./theme-validation) to catch a missing variable or scope.
