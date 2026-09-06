import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render } from '@/lib/storybook';
import { ConfirmDialog } from '.';
import ConfirmDialogDefault from './examples/ConfirmDialogDefault.vue';
import confirmDialogDefaultSource from './examples/ConfirmDialogDefault.vue?raw';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  render: render({ ConfirmDialogDefault }, `<ConfirmDialogDefault />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: example(confirmDialogDefaultSource),
};
