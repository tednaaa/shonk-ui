import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CopyIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
} from '@lucide/vue';
import { example, render, showControls } from '@/lib/storybook';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '.';
import InputGroupWithTextarea from './examples/InputGroupWithTextarea.vue';
import inputGroupWithTextareaSource from './examples/InputGroupWithTextarea.vue?raw';

const components = {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  CopyIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
};

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  render: render(
    components,
    `<div class="max-w-sm">
      <InputGroup v-bind="args">
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithText: Story = {
  render: render(
    components,
    `<div class="max-w-sm">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>`,
  ),
};

export const WithButton: Story = {
  render: render(
    components,
    `<div class="max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder="https://example.com/invite/xyz" readonly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Copy"><CopyIcon /></InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>`,
  ),
};

export const Disabled: Story = {
  render: render(
    components,
    `<div class="max-w-sm">
      <InputGroup data-disabled="true">
        <InputGroupInput placeholder="Search…" disabled />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>`,
  ),
};

export const WithTextarea: Story = {
  parameters: example(inputGroupWithTextareaSource),
  render: render({ InputGroupWithTextarea }, `<div class="max-w-sm"><InputGroupWithTextarea /></div>`),
};
