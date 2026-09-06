import { templateSource } from '@/lib/storybook';

function context(story: unknown, args: Record<string, unknown> = {}) {
  return { originalStoryFn: () => story, args } as never;
}

it('returns the evaluated template instead of the story object', () => {
  const template = `
      <div class="mx-auto max-w-sm">
        <Button v-bind="args">Button</Button>
      </div>
    `;

  expect(templateSource('IGNORED', context({ template }, { loading: true, size: 'lg', trigger: () => {} })))
    .toBe('<div class="mx-auto max-w-sm">\n  <Button loading size="lg">Button</Button>\n</div>');
});

it('serialises non-string args as bindings', () => {
  const template = `<Combobox v-bind="args" />`;

  expect(templateSource('IGNORED', context({ template }, { options: ['a', 'b'], openThreshold: 0.9, disabled: false })))
    .toBe(`<Combobox :options="['a','b']" :open-threshold="0.9" :disabled="false" />`);
});

it('falls back to the generated code when a story has no template', () => {
  expect(templateSource('FALLBACK', context({ render: () => null }))).toBe('FALLBACK');
});
