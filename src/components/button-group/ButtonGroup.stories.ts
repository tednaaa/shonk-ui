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
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
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
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>`,
  ),
};

export const WithSeparator: Story = {
  render: render(
    { ButtonGroup, Button, ButtonGroupSeparator },
    `<ButtonGroup>
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
    </ButtonGroup>`,
  ),
};

export const WithText: Story = {
  render: render(
    { ButtonGroup, Button, ButtonGroupText },
    `<ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">shonk-ui.dev</Button>
    </ButtonGroup>`,
  ),
};

export const Toolbar: Story = {
  render: render(
    { ButtonGroup, Button, BoldIcon, ItalicIcon, UnderlineIcon },
    `<ButtonGroup>
      <Button variant="outline" size="icon"><BoldIcon /></Button>
      <Button variant="outline" size="icon"><ItalicIcon /></Button>
      <Button variant="outline" size="icon"><UnderlineIcon /></Button>
    </ButtonGroup>`,
  ),
};
