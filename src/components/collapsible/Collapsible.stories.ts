import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ChevronsUpDownIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '.';
import { Button } from '../button';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  render: render(
    { Collapsible, CollapsibleTrigger, CollapsibleContent, Button, ChevronsUpDownIcon },
    `<div class="w-80">
      <Collapsible v-bind="args" class="space-y-2">
        <div class="flex items-center justify-between gap-4 px-1">
          <h4 class="text-sm font-semibold">@acme starred 3 repositories</h4>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="icon-sm">
              <ChevronsUpDownIcon />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div class="border-border-default rounded-md border px-4 py-2 font-mono text-sm">@acme/ui</div>
        <CollapsibleContent class="space-y-2">
          <div class="border-border-default rounded-md border px-4 py-2 font-mono text-sm">@acme/tokens</div>
          <div class="border-border-default rounded-md border px-4 py-2 font-mono text-sm">@acme/icons</div>
        </CollapsibleContent>
      </Collapsible>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ShowMore: Story = {
  render: render(
    { Collapsible, CollapsibleTrigger, CollapsibleContent, Button },
    `<div class="w-96">
      <Collapsible class="space-y-2">
        <p class="text-text-secondary text-sm">
          A component library built on accessible primitives and Tailwind utility classes.
        </p>
        <CollapsibleContent class="space-y-2">
          <p class="text-text-secondary text-sm">
            It ships themeable primitives, dark mode, and Storybook docs for every component, so
            product teams can compose consistent interfaces quickly.
          </p>
        </CollapsibleContent>
        <CollapsibleTrigger as-child>
          <Button variant="link" class="px-0">Show more</Button>
        </CollapsibleTrigger>
      </Collapsible>
    </div>`,
  ),
};
