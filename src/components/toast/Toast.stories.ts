import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render } from '@/lib/storybook';
import { Toaster } from '.';
import ToastDefault from './examples/ToastDefault.vue';
import toastDefaultSource from './examples/ToastDefault.vue?raw';
import ToastVariants from './examples/ToastVariants.vue';
import toastVariantsSource from './examples/ToastVariants.vue?raw';
import ToastWithAction from './examples/ToastWithAction.vue';
import toastWithActionSource from './examples/ToastWithAction.vue?raw';
import ToastWithPromise from './examples/ToastWithPromise.vue';
import toastWithPromiseSource from './examples/ToastWithPromise.vue?raw';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: example(toastDefaultSource),
  render: render({ ToastDefault }, `<ToastDefault />`),
};

export const Variants: Story = {
  parameters: example(toastVariantsSource),
  render: render({ ToastVariants }, `<ToastVariants />`),
};

export const WithAction: Story = {
  parameters: example(toastWithActionSource),
  render: render({ ToastWithAction }, `<ToastWithAction />`),
};

export const WithPromise: Story = {
  parameters: example(toastWithPromiseSource),
  render: render({ ToastWithPromise }, `<ToastWithPromise />`),
};
