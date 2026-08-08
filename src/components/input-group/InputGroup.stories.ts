import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CopyIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
} from '@lucide/vue';
import { ref } from 'vue';
import { render, showControls } from '@/lib/storybook';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '.';

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
        <InputGroupInput placeholder="https://shonk-ui.dev/invite/xyz" readonly />
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
  render: () => ({
    components,
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <div class="max-w-sm">
        <InputGroup>
          <InputGroupTextarea v-model="value" placeholder="Ask, search, or chat…" />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-xs" aria-label="Add attachment"><PlusIcon /></InputGroupButton>
            <InputGroupText><InfoIcon />{{ value.length }} chars</InputGroupText>
            <InputGroupButton variant="default" size="sm" class="ml-auto">Send <SendIcon /></InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    `,
  }),
};
