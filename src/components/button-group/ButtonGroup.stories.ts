import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { BoldIcon, ItalicIcon, UnderlineIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '.';
import { Button } from '../button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  render: render(
    { ButtonGroup, Button },
    `<ButtonGroup v-bind="args">
      <Button variant="secondary">One</Button>
      <Button variant="secondary">Two</Button>
      <Button variant="secondary">Three</Button>
    </ButtonGroup>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Vertical: Story = {
  render: render(
    { ButtonGroup, Button },
    `<ButtonGroup orientation="vertical">
      <Button variant="secondary">Top</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Bottom</Button>
    </ButtonGroup>`,
  ),
};

export const WithSeparator: Story = {
  render: render(
    { ButtonGroup, Button, ButtonGroupSeparator },
    `<ButtonGroup>
      <Button variant="secondary">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Paste</Button>
    </ButtonGroup>`,
  ),
};

export const WithText: Story = {
  render: render(
    { ButtonGroup, Button, ButtonGroupText },
    `<ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="secondary">example.com</Button>
    </ButtonGroup>`,
  ),
};

export const Toolbar: Story = {
  render: render(
    { ButtonGroup, Button, BoldIcon, ItalicIcon, UnderlineIcon },
    `<ButtonGroup>
      <Button variant="secondary" size="icon"><BoldIcon /></Button>
      <Button variant="secondary" size="icon"><ItalicIcon /></Button>
      <Button variant="secondary" size="icon"><UnderlineIcon /></Button>
    </ButtonGroup>`,
  ),
};
