import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render } from '@/lib/storybook';
import { Toaster } from '.';
import ToastDefault from './_examples/ToastDefault.vue';
import toastDefaultSource from './_examples/ToastDefault.vue?raw';
import ToastVariants from './_examples/ToastVariants.vue';
import toastVariantsSource from './_examples/ToastVariants.vue?raw';
import ToastWithAction from './_examples/ToastWithAction.vue';
import toastWithActionSource from './_examples/ToastWithAction.vue?raw';
import ToastWithPromise from './_examples/ToastWithPromise.vue';
import toastWithPromiseSource from './_examples/ToastWithPromise.vue?raw';

const meta: Meta<typeof Toaster> = {
	title: 'Feedback/Toast',
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
