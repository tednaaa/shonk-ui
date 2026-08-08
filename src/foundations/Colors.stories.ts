import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface ColorToken {
  name: string;
  token: string;
}

const text: readonly ColorToken[] = [
  { name: 'primary', token: '--color-text-primary' },
  { name: 'secondary', token: '--color-text-secondary' },
  { name: 'tertiary', token: '--color-text-tertiary' },
  { name: 'disabled', token: '--color-text-disabled' },
  { name: 'inverse', token: '--color-text-inverse' },
  { name: 'brand', token: '--color-text-brand' },
  { name: 'danger', token: '--color-text-danger' },
  { name: 'success', token: '--color-text-success' },
  { name: 'warning', token: '--color-text-warning' },
] as const;

const background: readonly ColorToken[] = [
  { name: 'surface', token: '--color-bg-surface' },
  { name: 'subtle', token: '--color-bg-subtle' },
  { name: 'muted', token: '--color-bg-muted' },
  { name: 'brand', token: '--color-bg-brand' },
  { name: 'brand-hover', token: '--color-bg-brand-hover' },
  { name: 'brand-active', token: '--color-bg-brand-active' },
  { name: 'brand-subtle', token: '--color-bg-brand-subtle' },
  { name: 'danger', token: '--color-bg-danger' },
  { name: 'danger-hover', token: '--color-bg-danger-hover' },
  { name: 'danger-subtle', token: '--color-bg-danger-subtle' },
  { name: 'success', token: '--color-bg-success' },
  { name: 'success-subtle', token: '--color-bg-success-subtle' },
  { name: 'warning', token: '--color-bg-warning' },
  { name: 'warning-subtle', token: '--color-bg-warning-subtle' },
  { name: 'disabled', token: '--color-bg-disabled' },
] as const;

const border: readonly ColorToken[] = [
  { name: 'default', token: '--color-border-default' },
  { name: 'strong', token: '--color-border-strong' },
  { name: 'brand', token: '--color-border-brand' },
  { name: 'danger', token: '--color-border-danger' },
  { name: 'focus', token: '--color-border-focus' },
  { name: 'disabled', token: '--color-border-disabled' },
] as const;

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => ({
    setup: () => ({ text, background, border }),
    template: `
      <div class="flex flex-col gap-10">
        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-text-tertiary">Text</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="t in text" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-bg-muted text-lg font-semibold" :style="{ color: 'var(' + t.token + ')' }">Ag</div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-text-primary">{{ t.name }}</span>
                <span class="truncate text-xs text-text-tertiary">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-text-tertiary">Background</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="t in background" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
              <div class="size-10 shrink-0 rounded-md border border-border-default" :style="{ backgroundColor: 'var(' + t.token + ')' }"></div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-text-primary">{{ t.name }}</span>
                <span class="truncate text-xs text-text-tertiary">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-text-tertiary">Border</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="t in border" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-3">
              <div class="size-10 shrink-0 rounded-md border-4 bg-bg-surface" :style="{ borderColor: 'var(' + t.token + ')' }"></div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-text-primary">{{ t.name }}</span>
                <span class="truncate text-xs text-text-tertiary">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
