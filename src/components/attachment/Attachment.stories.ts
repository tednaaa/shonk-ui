import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { AlertCircleIcon, FileTextIcon, XIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentGroup,
	AttachmentMedia,
	AttachmentTitle,
	AttachmentTrigger,
} from '.';
import { Spinner } from '../spinner';

const components = {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentGroup,
	AttachmentMedia,
	AttachmentTitle,
	AttachmentTrigger,
	Spinner,
	AlertCircleIcon,
	FileTextIcon,
	XIcon,
};

const image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop';

const meta: Meta<typeof Attachment> = {
	title: 'Data/Attachment',
	component: Attachment,
	tags: ['autodocs'],
	args: { state: 'done' },
	render: render(
		components,
		`<Attachment v-bind="args">
      <AttachmentMedia><FileTextIcon /></AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction>
      </AttachmentActions>
    </Attachment>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const States: Story = {
	render: () => ({
		components,
		setup: () => ({
			items: [
				{ state: 'idle', description: 'Ready to upload' },
				{ state: 'uploading', description: 'Uploading… 42%' },
				{ state: 'processing', description: 'Processing…' },
				{ state: 'error', description: 'Upload failed' },
				{ state: 'done', description: '2.4 MB' },
			],
		}),
		template: `
  <div class="flex flex-col gap-2">
    <Attachment v-for="item in items" :key="item.state" :state="item.state">
      <AttachmentMedia>
        <Spinner v-if="item.state === 'uploading' || item.state === 'processing'" />
        <AlertCircleIcon v-else-if="item.state === 'error'" />
        <FileTextIcon v-else />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>{{ item.description }}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction>
      </AttachmentActions>
    </Attachment>
  </div>
`,
	}),
};

export const Image: Story = {
	render: () => ({
		components,
		setup: () => ({ image }),
		template: `
  <Attachment>
    <AttachmentMedia variant="image"><img :src="image" alt=""></AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>landscape.jpg</AttachmentTitle>
      <AttachmentDescription>860 KB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
`,
	}),
};

export const Vertical: Story = {
	render: () => ({
		components,
		setup: () => ({ image }),
		template: `
  <AttachmentGroup class="max-w-md">
    <Attachment v-for="n in 5" :key="n" orientation="vertical">
      <AttachmentMedia variant="image"><img :src="image" alt=""></AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>photo-{{ n }}.jpg</AttachmentTitle>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove" variant="secondary" size="icon-xs"><XIcon /></AttachmentAction>
      </AttachmentActions>
    </Attachment>
  </AttachmentGroup>
`,
	}),
};

export const Sizes: Story = {
	render: render(
		components,
		`<div class="flex flex-col items-start gap-2">
      <Attachment v-for="size in ['default', 'sm', 'xs']" :key="size" :size="size">
        <AttachmentMedia><FileTextIcon /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>notes-{{ size }}.txt</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>`,
	),
};

export const Link: Story = {
	render: render(
		components,
		`<Attachment>
      <AttachmentTrigger as="a" href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Open quarterly-report.pdf" />
      <AttachmentMedia><FileTextIcon /></AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>Opens in a new tab</AttachmentDescription>
      </AttachmentContent>
    </Attachment>`,
	),
};
