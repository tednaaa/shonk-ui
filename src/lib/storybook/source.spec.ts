import { ref } from 'vue';
import { templateSource } from '@/lib/storybook';

function context(story: unknown, args: Record<string, unknown> = {}) {
  return { originalStoryFn: () => story, args } as never;
}

it('wraps the story template in an sfc and imports what it renders', () => {
  const template = `
      <div class="max-w-sm">
        <Button v-bind="args">Button</Button>
      </div>
    `;

  expect(templateSource('IGNORED', context({ components: { Button: {} }, template }, { loading: true, size: 'lg' })))
    .toBe([
      `<script setup lang="ts">`,
      `import { Button } from 'shonk-ui';`,
      `</script>`,
      ``,
      `<template>`,
      `  <div class="max-w-sm">`,
      `    <Button loading size="lg">Button</Button>`,
      `  </div>`,
      `</template>`,
    ].join('\n'));
});

it('groups imports by where each component comes from', () => {
  const story = {
    components: { Button: {}, Input: {}, StoryLabel: {}, Trash2Icon: {}, VisuallyHidden: {} },
    template: `<Button><Trash2Icon /></Button>`,
  };

  expect(templateSource('IGNORED', context(story)).split('\n').slice(1, 4)).toEqual([
    `import { Trash2Icon } from '@lucide/vue';`,
    `import { VisuallyHidden } from 'reka-ui';`,
    `import { Button, Input } from 'shonk-ui';`,
  ]);
});

it('breaks a long import list across lines', () => {
  const components = Object.fromEntries(
    ['TagsInput', 'TagsInputInput', 'TagsInputItem', 'TagsInputItemDelete', 'TagsInputItemText']
      .map(name => [name, {}]),
  );

  expect(templateSource('IGNORED', context({ components, template: `<TagsInput />` }))).toContain([
    `import {`,
    `  TagsInput,`,
    `  TagsInputInput,`,
    `  TagsInputItem,`,
    `  TagsInputItemDelete,`,
    `  TagsInputItemText,`,
    `} from 'shonk-ui';`,
  ].join('\n'));
});

it('declares the state a story sets up, importing ref when it needs one', () => {
  const story = {
    components: { TagsInput: {} },
    setup: () => ({ args: {}, modelValue: ref(['Vue', 'Nuxt', 'Vite']), size: 3 }),
    template: `<TagsInput v-model="modelValue" />`,
  };

  expect(templateSource('IGNORED', context(story))).toBe([
    `<script setup lang="ts">`,
    `import { TagsInput } from 'shonk-ui';`,
    `import { ref } from 'vue';`,
    ``,
    `const modelValue = ref(['Vue', 'Nuxt', 'Vite']);`,
    `const size = 3;`,
    `</script>`,
    ``,
    `<template>`,
    `  <TagsInput v-model="modelValue" />`,
    `</template>`,
  ].join('\n'));
});

it('puts one entry per line once a list outgrows the inline width', () => {
  const steps = [
    { step: 1, title: 'Details', description: 'Your info' },
    { step: 2, title: 'Shipping', description: 'Pick a method' },
  ];

  expect(templateSource('IGNORED', context({ setup: () => ({ steps }), template: `<p />` }))).toContain([
    `const steps = [`,
    `  { step: 1, title: 'Details', description: 'Your info' },`,
    `  { step: 2, title: 'Shipping', description: 'Pick a method' },`,
    `];`,
  ].join('\n'));
});

it('omits the state rather than silently dropping values it cannot write out', () => {
  const items = [{ title: 'Home', icon: () => null }];
  const story = { components: { Sidebar: {} }, setup: () => ({ items }), template: `<Sidebar />` };

  expect(templateSource('IGNORED', context(story))).not.toContain('const items');
});

it('drops storybook-only labels from the markup', () => {
  const story = {
    components: { Input: {}, StoryLabel: {} },
    template: `<div class="grid gap-2"><StoryLabel>Email</StoryLabel><Input type="email" /></div>`,
  };

  expect(templateSource('IGNORED', context(story))).toContain('<div class="grid gap-2"><Input type="email" /></div>');
});

it('serialises non-string args as bindings', () => {
  const story = { components: { Combobox: {} }, template: `<Combobox v-bind="args" />` };
  const args = { options: ['a', 'b'], openThreshold: 0.9, disabled: false, onSelect: () => {} };

  expect(templateSource('IGNORED', context(story, args)))
    .toContain(`<Combobox :options="['a','b']" :open-threshold="0.9" :disabled="false" />`);
});

it('leaves out the script block when nothing needs importing', () => {
  const story = { components: { StoryLabel: {} }, template: `<p>plain</p>` };

  expect(templateSource('IGNORED', context(story))).toBe('<template>\n  <p>plain</p>\n</template>');
});

it('falls back to the generated code when a story has no template', () => {
  expect(templateSource('FALLBACK', context({ render: () => null }))).toBe('FALLBACK');
});
