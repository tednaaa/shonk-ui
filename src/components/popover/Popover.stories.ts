import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '.';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const components = {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
  Label,
};

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  render: render(
    components,
    `<Popover v-bind="args">
      <PopoverTrigger as-child>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div class="grid gap-2">
          <h4 class="leading-none font-medium">About</h4>
          <p class="text-text-tertiary text-sm">
            Popovers float above the page and are anchored to their trigger.
          </p>
        </div>
      </PopoverContent>
    </Popover>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithForm: Story = {
  render: render(
    components,
    `<Popover v-bind="args">
      <PopoverTrigger as-child>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent class="w-80">
        <div class="grid gap-4">
          <div class="grid gap-1">
            <h4 class="leading-none font-medium">Dimensions</h4>
            <p class="text-text-tertiary text-sm">Set the dimensions for the layer.</p>
          </div>
          <div class="grid gap-2">
            <div class="grid grid-cols-3 items-center gap-4">
              <Label for="width">Width</Label>
              <Input id="width" default-value="100%" class="col-span-2 h-8" />
            </div>
            <div class="grid grid-cols-3 items-center gap-4">
              <Label for="height">Height</Label>
              <Input id="height" default-value="25px" class="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>`,
  ),
};

export const Placement: Story = {
  render: render(
    components,
    `<Popover v-bind="args">
      <PopoverTrigger as-child>
        <Button variant="outline">Open to the right</Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" class="w-60">
        <p class="text-sm">Use <code>side</code> and <code>align</code> on PopoverContent to control placement.</p>
      </PopoverContent>
    </Popover>`,
  ),
};

export const Anchored: Story = {
  render: render(
    components,
    `<Popover v-bind="args">
      <PopoverAnchor as-child>
        <div class="rounded-md border border-dashed p-6 text-text-tertiary text-sm">Anchor element</div>
      </PopoverAnchor>
      <PopoverTrigger as-child>
        <Button variant="outline" class="mt-4">Toggle popover</Button>
      </PopoverTrigger>
      <PopoverContent class="w-60">
        <p class="text-sm">This content is positioned against the anchor, not the trigger.</p>
      </PopoverContent>
    </Popover>`,
  ),
};
