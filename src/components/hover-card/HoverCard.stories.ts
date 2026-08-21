import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '.';
import { Avatar, AvatarFallback } from '../avatar';
import { Button } from '../button';

const components = {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Avatar,
  AvatarFallback,
  Button,
  CalendarIcon,
};

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  render: render(
    components,
    `<HoverCard v-bind="args">
      <HoverCardTrigger as-child>
        <Button variant="link">@acme</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-80">
        <div class="flex justify-between gap-4">
          <Avatar class="size-12">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">@acme</h4>
            <p class="text-sm">Design system team building shared UI for the product suite.</p>
            <div class="text-text-tertiary flex items-center pt-2 text-xs">
              <CalendarIcon class="mr-2 size-4 opacity-70" />
              <span>Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const TextOnly: Story = {
  render: render(
    components,
    `<HoverCard>
      <HoverCardTrigger as-child>
        <Button variant="link">Design tokens</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-72">
        <p class="text-sm font-semibold">Design tokens</p>
        <p class="text-text-secondary pt-1 text-sm">
          Semantic CSS variables that keep colors, spacing and radii consistent across every component.
        </p>
      </HoverCardContent>
    </HoverCard>`,
  ),
};
