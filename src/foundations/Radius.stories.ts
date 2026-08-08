import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface RadiusToken {
  cls: string;
  name: string;
  token: string;
}

const radii: readonly RadiusToken[] = [
  { cls: 'rounded-sm', name: 'sm', token: '--radius-sm · 6px' },
  { cls: 'rounded-md', name: 'md', token: '--radius-md · 8px' },
  { cls: 'rounded-lg', name: 'lg', token: '--radius-lg · 10px' },
  { cls: 'rounded-xl', name: 'xl', token: '--radius-xl · 14px' },
  { cls: 'rounded-full', name: 'full', token: '9999px' },
] as const;

const meta: Meta = {
  title: 'Foundations/Radius',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Radius: Story = {
  render: () => ({
    setup: () => ({ radii }),
    template: `
      <div class="flex flex-wrap gap-6">
        <div v-for="r in radii" :key="r.cls" class="flex flex-col items-center gap-2">
          <div class="size-20 border border-border-brand bg-bg-brand-subtle" :class="r.cls"></div>
          <span class="text-sm text-text-primary">{{ r.name }}</span>
          <span class="text-xs text-text-tertiary">{{ r.token }}</span>
        </div>
      </div>
    `,
  }),
};
