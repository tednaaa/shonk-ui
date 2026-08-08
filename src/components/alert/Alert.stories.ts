import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import { Alert } from '.';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Heads up!',
  },
  render: render(
    { Alert },
    `<Alert v-bind="args" class="max-w-md">You can add components to your app using the CLI.</Alert>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Variants: Story = {
  render: render(
    { Alert, StoryLabel },
    `<div class="flex gap-12">
      <div class="flex max-w-md flex-col gap-6">
        <StoryLabel>With title</StoryLabel>
        <Alert title="Default">This is a default alert with neutral styling.</Alert>
        <Alert variant="success" title="Success">Your changes have been saved successfully.</Alert>
        <Alert variant="warning" title="Warning">Your subscription is about to expire.</Alert>
        <Alert variant="destructive" title="Error">Something went wrong while saving your changes.</Alert>
      </div>
      <div class="flex max-w-md flex-col gap-6">
        <StoryLabel>Without title</StoryLabel>
        <Alert>A neutral message with body content only — no title or icon.</Alert>
        <Alert variant="success">Your changes have been saved.</Alert>
        <Alert variant="warning">Your subscription is about to expire.</Alert>
        <Alert variant="destructive">Something went wrong while saving.</Alert>
      </div>
    </div>`,
  ),
};

export const Appearances: Story = {
  render: render(
    { Alert, StoryLabel },
    `<div class="flex gap-12">
      <div class="flex max-w-md flex-col gap-6">
        <StoryLabel>With title</StoryLabel>
        <Alert variant="success" appearance="default" title="Default">Bordered, rounded container.</Alert>
        <Alert variant="success" appearance="simple" title="Simple">No border and no radius.</Alert>
        <Alert variant="success" appearance="text" title="Text">Transparent with no padding.</Alert>
      </div>
      <div class="flex max-w-md flex-col gap-6">
        <StoryLabel>Without title</StoryLabel>
        <Alert variant="success" appearance="default">Default appearance with body content only.</Alert>
        <Alert variant="success" appearance="simple">Simple appearance with body content only.</Alert>
        <Alert variant="success" appearance="text">Text appearance with body content only.</Alert>
      </div>
    </div>`,
  ),
};
