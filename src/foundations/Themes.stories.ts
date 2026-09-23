import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface Preset {
  name: string;
  summary: string;
}

const presets: readonly Preset[] = [
  { name: 'atlas', summary: 'White day, deep neutral night, one blue. Also the default.' },
  { name: 'graphite', summary: 'Near-neutral greys and one confident blue.' },
  { name: 'nocturne', summary: 'Navy surfaces on both sides, cool saturated accents.' },
  { name: 'orchid', summary: 'Lavender-tinted neutrals and a violet primary.' },
] as const;

const appearances = ['light', 'dark'] as const;

const meta: Meta = {
  title: 'Foundations/Themes',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Themes: Story = {
  render: () => ({
    setup: () => ({ presets, appearances }),
    template: `
      <div class="flex flex-col gap-10">
        <section v-for="preset in presets" :key="preset.name" class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-foreground">{{ preset.name }}</p>
            <p class="text-xs text-muted-foreground">{{ preset.summary }}</p>
            <code class="w-fit rounded-md bg-muted px-2 py-1 text-xs text-foreground select-all">@import "shonk-ui/themes/{{ preset.name }}.css";</code>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="appearance in appearances"
              :key="appearance"
              :data-theme="preset.name"
              :class="['overflow-hidden rounded-lg border border-border bg-background', appearance === 'dark' && 'dark']"
            >
              <div class="flex items-center justify-between border-b border-border bg-card px-3 py-2">
                <span class="text-sm text-card-foreground">Aa</span>
                <span class="text-xs text-muted-foreground">{{ appearance }}</span>
              </div>

              <div class="flex flex-col gap-2 p-3">
                <div class="flex flex-wrap gap-2">
                  <span class="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">Primary</span>
                  <span class="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Secondary</span>
                  <span class="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">Accent</span>
                  <span class="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Muted</span>
                </div>

                <div class="flex gap-2">
                  <span class="size-6 rounded-md bg-destructive"></span>
                  <span class="size-6 rounded-md bg-success"></span>
                  <span class="size-6 rounded-md bg-warning"></span>
                  <span class="size-6 rounded-md bg-info"></span>
                </div>

                <div class="h-8 rounded-md border border-input bg-background"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
