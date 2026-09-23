---
name: write-stories
description: Write or update Storybook stories for shonk-ui components. Use when adding a *.stories.ts in src/components or scaling stories across the library.
---

# Writing Storybook stories (shonk-ui)

Storybook 10 + `@storybook/vue3-vite`, CSF3, Tailwind v4, reka-ui. One story file per group: `src/components/<group>/<Primary>.stories.ts`. First read the group's `index.ts` + `.vue` files for exact exports, props/variants, slots, and v-model.

## Pattern

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Switch } from '.';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  render: render({ Switch }, `<Switch v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { parameters: showControls };
export const Checked: Story = { args: { defaultValue: true } };
```

## Rules

- `const meta: Meta<typeof X>` annotation — NOT `satisfies` (triggers TS4023 under `pnpm typecheck`).
- `title: 'Components/<PascalCase>'`, `tags: ['autodocs']`.
- Don't write `argTypes` — auto-generated via `vue-component-meta`; override only when needed.
- Controls are off globally; the arg-driven story (usually `Default`) re-enables with `parameters: showControls`. Hardcoded showcase stories need nothing.
- No comments. No unused imports (`import type` for types). No `@storybook/test` / play functions.
- Don't name a story export after a global you use in its body — `export const Promise` shadows the `Promise` constructor (TS2351 on `new Promise`). Use `WithPromise`, `DateStory`, etc.
- Imports: own group from `'.'`, cross-group from `'../<group>'`, icons from `'@lucide/vue'`, helpers from `'@/lib/storybook'`.

## Helpers (`@/lib/storybook`)

- `render(components, template)` — render from a template string; `args` is exposed (`v-bind="args"`).
- `example(source, description?)` — `parameters` preset that shows a `?raw` import verbatim in the code panel.
- `StorybookLabel` — muted caption for labelling groups (register it in the render's components).
- `showControls` / `hideControls` — `parameters` presets.

## Template strings

A template with a wrapper opens on the backtick line and gives every element its own line. `dedent` strips the common indent, so the code panel shows it the way it is written here.

```ts
render: render({ Input }, `
  <div class="max-w-xs">
    <Input v-bind="args" placeholder="Email" />
  </div>
`),
```

Only a lone element with no wrapper stays inline — `` `<Switch v-bind="args" />` ``.

## The code panel is generated, not read from the story file

`templateSource` rebuilds an SFC out of the story's template, components and `setup()` bindings, so what a reader copies is never quite what is authored.

- A `setup()` binding that is not plain data — a component, a class instance — drops the whole script block, leaving the template referring to names that appear nowhere.
- A large object handed through `args` is stringified into the tag, unreadable past a few keys.
- Type annotations are gone either way, since only runtime values survive.

#### Reach for an example file when any of those bite

- Put it in `src/components/<group>/examples/<Group><Case>.vue`, importing from `'shonk-ui'`.
- Import it twice in the story — the component, and its source with `?raw`.
- `parameters: example(<case>Source)` then prints the real file, `<script setup>` and all.

```ts
export const WithIcons: Story = {
  parameters: example(filteredSearchIconsSource),
  render: render({ FilteredSearchIcons }, `
    <div class="max-w-xl">
      <FilteredSearchIcons />
    </div>
  `),
};
```

A component configured by a large array — data-table columns, filtered-search definitions — becomes an example file for every story but `Default`, which stays arg-driven for its controls.

## Coverage

`Default` (arg-driven, `showControls`) + a story per meaningful variant/state/slot + one realistic composition. Add `args` only when required (e.g. reka needs Accordion's `type`) or to seed content. Override `render` for showcase grids.

- Only showcase real variant **props**. If size/color/etc. is set purely via `class` (no variant prop — e.g. `Skeleton`, `Spinner`), don't fabricate a `Sizes`/`Colors` story; the `class` control in `Default` already covers it. Prefer a realistic composition (`Spinner` in a `Button`, `Skeleton` as a card) instead.

- Stateful (v-model): prefer uncontrolled `defaultValue`/`defaultOpen`; for live state use an inline render with `setup()` returning a `ref`.
- Compound: compose all sub-components. Providers: wrap (Tooltip→TooltipProvider, Sidebar→SidebarProvider, toast→Toaster). Overlays: add a trigger.
- Sizing: constrain wide controls with a `max-w` **div wrapper** around the component — never a `max-w`/fixed-`w-[…]` class on the component itself.
  - Full-width components (`Input`, `InputGroup`, `InputPassword`, `Textarea`, `Combobox`, …): just wrap.
  - `w-fit` components whose trigger you want to fill the wrapper (`Select`, …): wrap **and** set the control to `w-full`.
  - Naturally-sized components (`NativeSelect` is `w-fit`, buttons, badges, `Calendar`/`RangeCalendar`) need no wrapper; size showcase rows with their own layout div.

## Verify

Have the user run `pnpm typecheck` and `eslint --fix <file>`, and review in Storybook (light + dark). New utility classes or `main.ts` changes need a dev-server restart.
