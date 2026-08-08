import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { showControls } from '@/lib/storybook';
import { Textarea } from '.';
import { Label } from '../label';

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
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('The quick brown fox jumps over the lazy dog.');
      return { value };
    },
    template: `<div class="max-w-sm"><Textarea v-model="value" /></div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { Textarea },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `<div class="max-w-sm"><Textarea v-model="value" placeholder="This field is disabled." disabled /></div>`,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    components: { Textarea, Label },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <div class="grid max-w-sm gap-2">
        <Label for="message">Your message</Label>
        <Textarea id="message" v-model="value" placeholder="Type your message here." />
      </div>
    `,
  }),
};
