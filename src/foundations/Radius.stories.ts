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
  { cls: 'rounded-2xl', name: '2xl', token: '--radius-2xl · 18px' },
  { cls: 'rounded-3xl', name: '3xl', token: '--radius-3xl · 22px' },
  { cls: 'rounded-4xl', name: '4xl', token: '--radius-4xl · 26px' },
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
          <div class="size-20 border border-primary bg-accent" :class="r.cls"></div>
          <span class="text-sm text-foreground">{{ r.name }}</span>
          <span class="text-xs text-muted-foreground">{{ r.token }}</span>
        </div>
      </div>
    `,
  }),
};
