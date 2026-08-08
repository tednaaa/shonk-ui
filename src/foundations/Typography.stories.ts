import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface TypeSample {
  cls: string;
  name: string;
}

const sizes: readonly TypeSample[] = [
  { cls: 'text-xs', name: 'text-xs · 12px' },
  { cls: 'text-sm', name: 'text-sm · 14px' },
  { cls: 'text-base', name: 'text-base · 16px' },
  { cls: 'text-lg', name: 'text-lg · 18px' },
  { cls: 'text-xl', name: 'text-xl · 20px' },
  { cls: 'text-2xl', name: 'text-2xl · 24px' },
  { cls: 'text-3xl', name: 'text-3xl · 30px' },
  { cls: 'text-4xl', name: 'text-4xl · 36px' },
] as const;

const weights: readonly TypeSample[] = [
  { cls: 'font-normal', name: 'font-normal · 400' },
  { cls: 'font-medium', name: 'font-medium · 500' },
  { cls: 'font-semibold', name: 'font-semibold · 600' },
  { cls: 'font-bold', name: 'font-bold · 700' },
] as const;

const sample = 'The quick brown fox jumps';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => ({
    setup: () => ({ sizes, weights, sample }),
    template: `
      <div class="flex flex-col gap-10">
        <section class="flex flex-col gap-2">
          <p class="text-sm font-medium text-text-tertiary">Font family</p>
          <div class="rounded-lg border border-border-default bg-bg-surface p-4">
            <p class="text-2xl text-text-primary">{{ sample }}</p>
            <p class="mt-1 text-xs text-text-tertiary">--font-sans · system-ui, sans-serif · base 14px</p>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-text-tertiary">Sizes</p>
          <div class="flex flex-col gap-4">
            <div v-for="s in sizes" :key="s.cls" class="flex items-baseline gap-4">
              <span class="w-32 shrink-0 text-xs text-text-tertiary">{{ s.name }}</span>
              <span class="truncate text-text-primary" :class="s.cls">{{ sample }}</span>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-text-tertiary">Weights</p>
          <div class="flex flex-col gap-4">
            <div v-for="w in weights" :key="w.cls" class="flex items-baseline gap-4">
              <span class="w-36 shrink-0 text-xs text-text-tertiary">{{ w.name }}</span>
              <span class="truncate text-lg text-text-primary" :class="w.cls">{{ sample }}</span>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
