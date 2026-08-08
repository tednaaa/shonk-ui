import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MailIcon, SearchIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Button } from '.';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  render: render({ Button }, `<Button v-bind="args">Button</Button>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Variants: Story = {
  render: render({ Button }, `
    <div class="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  `),
};

export const Sizes: Story = {
  render: render({ Button }, `
    <div class="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  `),
};

export const IconButtons: Story = {
  render: render({ Button, SearchIcon }, `
    <div class="flex items-center gap-3">
      <Button size="icon-sm" aria-label="Search"><SearchIcon /></Button>
      <Button size="icon" aria-label="Search"><SearchIcon /></Button>
      <Button size="icon-lg" aria-label="Search"><SearchIcon /></Button>
    </div>
  `),
};

export const WithIcon: Story = {
  render: render({ Button, MailIcon }, `<Button><MailIcon /> Login with Email</Button>`),
};

export const Loading: Story = {
  args: { loading: true },
  render: render({ Button }, `<Button v-bind="args">Saving...</Button>`),
};

export const Disabled: Story = {
  args: { disabled: true },
};
