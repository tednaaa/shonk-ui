import type { Meta, StoryObj } from '@storybook/vue3-vite';

interface ColorPair {
  name: string;
  surface: string;
  foreground: string;
}

interface ColorToken {
  name: string;
  token: string;
}

const surfaces: readonly ColorPair[] = [
  { name: 'background', surface: '--background', foreground: '--foreground' },
  { name: 'card', surface: '--card', foreground: '--card-foreground' },
  { name: 'popover', surface: '--popover', foreground: '--popover-foreground' },
  { name: 'primary', surface: '--primary', foreground: '--primary-foreground' },
  { name: 'secondary', surface: '--secondary', foreground: '--secondary-foreground' },
  { name: 'muted', surface: '--muted', foreground: '--muted-foreground' },
  { name: 'accent', surface: '--accent', foreground: '--accent-foreground' },
  { name: 'destructive', surface: '--destructive', foreground: '--destructive-foreground' },
  { name: 'success', surface: '--success', foreground: '--success-foreground' },
  { name: 'warning', surface: '--warning', foreground: '--warning-foreground' },
] as const;

const lines: readonly ColorToken[] = [
  { name: 'border', token: '--border' },
  { name: 'input', token: '--input' },
  { name: 'ring', token: '--ring' },
] as const;

const charts: readonly ColorToken[] = [
  { name: 'chart-1', token: '--chart-1' },
  { name: 'chart-2', token: '--chart-2' },
  { name: 'chart-3', token: '--chart-3' },
  { name: 'chart-4', token: '--chart-4' },
  { name: 'chart-5', token: '--chart-5' },
] as const;

const sidebar: readonly ColorPair[] = [
  { name: 'sidebar', surface: '--sidebar', foreground: '--sidebar-foreground' },
  { name: 'sidebar-primary', surface: '--sidebar-primary', foreground: '--sidebar-primary-foreground' },
  { name: 'sidebar-accent', surface: '--sidebar-accent', foreground: '--sidebar-accent-foreground' },
] as const;

const sidebarLines: readonly ColorToken[] = [
  { name: 'sidebar-border', token: '--sidebar-border' },
  { name: 'sidebar-ring', token: '--sidebar-ring' },
] as const;

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => ({
    setup: () => ({ surfaces, lines, charts, sidebar, sidebarLines }),
    template: `
      <div class="flex flex-col gap-10">
        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-muted-foreground">Surfaces</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="p in surfaces" :key="p.name" class="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-lg font-semibold" :style="{ backgroundColor: 'var(' + p.surface + ')', color: 'var(' + p.foreground + ')' }">Ag</div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-card-foreground">{{ p.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ p.surface }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ p.foreground }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-muted-foreground">Lines</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="t in lines" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div class="size-10 shrink-0 rounded-md border-4 bg-background" :style="{ borderColor: 'var(' + t.token + ')' }"></div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-card-foreground">{{ t.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-muted-foreground">Charts</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="t in charts" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div class="size-10 shrink-0 rounded-md border border-border" :style="{ backgroundColor: 'var(' + t.token + ')' }"></div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-card-foreground">{{ t.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <p class="text-sm font-medium text-muted-foreground">Sidebar</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="p in sidebar" :key="p.name" class="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-lg font-semibold" :style="{ backgroundColor: 'var(' + p.surface + ')', color: 'var(' + p.foreground + ')' }">Ag</div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-card-foreground">{{ p.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ p.surface }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ p.foreground }}</span>
              </div>
            </div>
            <div v-for="t in sidebarLines" :key="t.token" class="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div class="size-10 shrink-0 rounded-md border-4 bg-background" :style="{ borderColor: 'var(' + t.token + ')' }"></div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm text-card-foreground">{{ t.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ t.token }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
