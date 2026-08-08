import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Spinner } from '.';
import { Button } from '../button';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  render: render({ Spinner }, `<Spinner v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const InButton: Story = {
  render: render(
    { Spinner, Button },
    `<Button disabled>
      <Spinner />
      Please wait
    </Button>`,
  ),
};
