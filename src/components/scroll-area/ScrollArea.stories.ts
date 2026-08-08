import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { ScrollArea } from '.';
import { Separator } from '../separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  render: render(
    { ScrollArea, Separator },
    `<div class="h-72 w-48">
      <ScrollArea v-bind="args" class="h-full w-full rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
          <template v-for="i in 30" :key="i">
            <div class="text-sm">v1.2.0-beta.{{ 31 - i }}</div>
            <Separator class="my-2" />
          </template>
        </div>
      </ScrollArea>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Prose: Story = {
  render: render(
    { ScrollArea },
    `<div class="h-72 w-full max-w-md">
      <ScrollArea class="h-full w-full rounded-md border">
        <div class="text-text-secondary space-y-4 p-4 text-sm">
          <h4 class="text-text-primary text-sm font-medium">Changelog</h4>
          <p>Shonk UI is a closed-source Vue component library built on reka-ui and Tailwind, shipping themeable primitives with dark mode support.</p>
          <p>Every component is documented in Storybook with light and dark previews, so product teams can compose consistent interfaces quickly.</p>
          <p>Design tokens are exposed as semantic CSS variables, keeping components aligned to a single source of truth across the whole system.</p>
          <p>The library favors accessible, unstyled primitives underneath, then layers on a cohesive visual language via Tailwind utility classes.</p>
          <p>Releases follow semantic versioning, and breaking changes are documented alongside migration notes in each entry of this changelog.</p>
        </div>
      </ScrollArea>
    </div>`,
  ),
};
