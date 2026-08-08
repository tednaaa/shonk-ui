import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Avatar, AvatarFallback, AvatarImage } from '.';

const components = { Avatar, AvatarFallback, AvatarImage };

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  render: render(
    components,
    `<Avatar v-bind="args">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Fallback: Story = {
  render: render(
    components,
    `<Avatar v-bind="args">
      <AvatarImage src="" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>`,
  ),
};
