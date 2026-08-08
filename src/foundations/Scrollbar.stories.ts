import type { Meta, StoryObj } from '@storybook/vue3-vite';

const items = Array.from({ length: 24 }, (_, i) => i + 1);
const cells = Array.from({ length: 64 }, (_, i) => i + 1);

const meta: Meta = {
  title: 'Foundations/Scrollbar',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrollbar: Story = {
  render: () => ({
    setup: () => ({ items, cells }),
    template: `
      <div class="grid gap-6 md:grid-cols-3">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-text-tertiary">Vertical</p>
          <div class="h-48 overflow-y-auto rounded-lg border border-border-default bg-bg-surface p-3">
            <div class="flex flex-col gap-2">
              <div v-for="n in items" :key="n" class="rounded-md bg-bg-subtle px-3 py-2 text-sm text-text-secondary">Row {{ n }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-text-tertiary">Horizontal</p>
          <div class="overflow-x-auto rounded-lg border border-border-default bg-bg-surface p-3">
            <div class="flex w-max gap-2">
              <div v-for="n in items" :key="n" class="flex size-24 shrink-0 items-center justify-center rounded-md bg-bg-subtle text-sm text-text-secondary">Col {{ n }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-text-tertiary">Both axes</p>
          <div class="h-48 overflow-auto rounded-lg border border-border-default bg-bg-surface p-3">
            <div class="grid w-max grid-cols-8 gap-2">
              <div v-for="n in cells" :key="n" class="flex size-16 items-center justify-center rounded-md bg-bg-subtle text-sm text-text-secondary">{{ n }}</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
