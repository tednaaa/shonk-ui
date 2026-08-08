import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface SpacingStep {
  cls: string;
  name: string;
  size: string;
}

const steps: readonly SpacingStep[] = [
  { cls: 'w-1', name: '1', size: '0.25rem · 4px' },
  { cls: 'w-2', name: '2', size: '0.5rem · 8px' },
  { cls: 'w-3', name: '3', size: '0.75rem · 12px' },
  { cls: 'w-4', name: '4', size: '1rem · 16px' },
  { cls: 'w-6', name: '6', size: '1.5rem · 24px' },
  { cls: 'w-8', name: '8', size: '2rem · 32px' },
  { cls: 'w-12', name: '12', size: '3rem · 48px' },
  { cls: 'w-16', name: '16', size: '4rem · 64px' },
  { cls: 'w-24', name: '24', size: '6rem · 96px' },
] as const;

const meta: Meta = {
  title: 'Foundations/Spacing',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: () => ({
    setup: () => ({ steps }),
    template: `
      <div class="flex flex-col gap-3">
        <div v-for="s in steps" :key="s.cls" class="flex items-center gap-4">
          <span class="w-8 shrink-0 text-sm text-text-primary">{{ s.name }}</span>
          <div class="h-4 rounded-sm bg-bg-brand" :class="s.cls"></div>
          <span class="text-xs text-text-tertiary">{{ s.size }}</span>
        </div>
      </div>
    `,
  }),
};
