import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { example, render, showControls } from '@/lib/storybook';
import { Textarea } from '.';
import TextareaDisabled from './examples/TextareaDisabled.vue';
import textareaDisabledSource from './examples/TextareaDisabled.vue?raw';
import TextareaPrefilled from './examples/TextareaPrefilled.vue';
import textareaPrefilledSource from './examples/TextareaPrefilled.vue?raw';
import TextareaWithLabel from './examples/TextareaWithLabel.vue';
import textareaWithLabelSource from './examples/TextareaWithLabel.vue?raw';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  render: args => ({
    components: { Textarea },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `<div class="max-w-sm"><Textarea v-bind="args" v-model="value" placeholder="Type your message here." /></div>`,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Prefilled: Story = {
  parameters: example(textareaPrefilledSource),
  render: render({ TextareaPrefilled }, `<div class="max-w-sm"><TextareaPrefilled /></div>`),
};

export const Disabled: Story = {
  parameters: example(textareaDisabledSource),
  render: render({ TextareaDisabled }, `<div class="max-w-sm"><TextareaDisabled /></div>`),
};

export const WithLabel: Story = {
  parameters: example(textareaWithLabelSource),
  render: render({ TextareaWithLabel }, `<div class="max-w-sm"><TextareaWithLabel /></div>`),
};
