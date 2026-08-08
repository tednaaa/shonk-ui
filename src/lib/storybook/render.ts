import type { Component } from 'vue';

type StoryComponents = Record<string, Component>;

export function render(components: StoryComponents, template: string) {
  return (args: unknown) => ({
    components,
    setup: () => ({ args }),
    template,
  });
}
