import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { showControls } from '@/lib/storybook';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '.';

const components = {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
};

const items = `
  <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
    <TagsInputItemText />
    <TagsInputItemDelete />
  </TagsInputItem>
  <TagsInputInput placeholder="Add framework…" />
`;

const meta: Meta<typeof TagsInput> = {
  title: 'Components/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  render: args => ({
    components,
    setup() {
      const modelValue = ref(['Vue', 'Nuxt', 'Vite']);
      return { args, modelValue };
    },
    template: `
      <div class="max-w-sm">
        <TagsInput v-model="modelValue" v-bind="args" class="w-full">
          ${items}
        </TagsInput>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Disabled: Story = {
  args: { disabled: true },
};
