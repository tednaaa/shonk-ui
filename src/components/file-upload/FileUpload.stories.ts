import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { FileRejection } from '.';
import { FileTextIcon, PaperclipIcon, XIcon } from '@lucide/vue';
import { ref, watch } from 'vue';
import { showControls } from '@/lib/storybook';
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from '.';
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from '../attachment';
import { Button } from '../button';
import { Spinner } from '../spinner';

const components = {
	FileUpload,
	FileUploadDropzone,
	FileUploadTrigger,
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
	Button,
	Spinner,
	FileTextIcon,
	PaperclipIcon,
	XIcon,
};

const reasons: Record<FileRejection['reason'], string> = {
	type: 'is not an image or PDF',
	size: 'is over 5 MB',
	count: 'is over the 3 file limit',
};

function formatSize(bytes: number) {
	return bytes < 1_000_000 ? `${Math.round(bytes / 1000)} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`;
}

const meta: Meta<typeof FileUpload> = {
	title: 'Forms/FileUpload',
	component: FileUpload,
	tags: ['autodocs'],
	args: { multiple: true, accept: 'image/*,.pdf', maxSize: 5_000_000, maxFiles: 3 },
	render: args => ({
		components,
		setup() {
			const files = ref<File[]>([]);
			const progress = ref(new Map<File, number>());
			const errors = ref<string[]>([]);

			watch(files, (current) => {
				for (const file of current) {
					if (progress.value.has(file))
						continue;
					progress.value.set(file, 0);
					const timer = setInterval(() => {
						const next = Math.min((progress.value.get(file) ?? 0) + 20, 100);
						progress.value.set(file, next);
						if (next === 100)
							clearInterval(timer);
					}, 400);
				}
			});

			function state(file: File) {
				return (progress.value.get(file) ?? 0) < 100 ? 'uploading' : 'done';
			}

			function remove(file: File) {
				files.value = files.value.filter(item => item !== file);
			}

			function onReject(rejections: FileRejection[]) {
				errors.value = rejections.map(({ file, reason }) => `${file.name} ${reasons[reason]}`);
			}

			return { args, files, progress, errors, state, remove, onReject, formatSize };
		},
		template: `
  <FileUpload v-model="files" v-bind="args" class="max-w-md" @reject="onReject">
    <FileUploadDropzone />
    <p v-for="error in errors" :key="error" class="text-sm text-destructive">{{ error }}</p>
    <Attachment v-for="file in files" :key="file.name" :state="state(file)" class="w-full">
      <AttachmentMedia>
        <Spinner v-if="state(file) === 'uploading'" />
        <FileTextIcon v-else />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{{ file.name }}</AttachmentTitle>
        <AttachmentDescription>
          {{ state(file) === 'uploading' ? 'Uploading… ' + progress.get(file) + '%' : formatSize(file.size) }}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove" @click="remove(file)"><XIcon /></AttachmentAction>
      </AttachmentActions>
    </Attachment>
  </FileUpload>
`,
	}),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const BrowseButton: Story = {
	render: () => ({
		components,
		setup: () => ({ files: ref<File[]>([]) }),
		template: `
  <FileUpload v-model="files" class="items-start">
    <FileUploadTrigger as-child>
      <Button variant="secondary"><PaperclipIcon />Attach file</Button>
    </FileUploadTrigger>
    <p class="text-sm text-muted-foreground">{{ files[0]?.name ?? 'No file chosen' }}</p>
  </FileUpload>
`,
	}),
};

export const CustomDropzone: Story = {
	render: () => ({
		components,
		setup: () => ({ files: ref<File[]>([]) }),
		template: `
  <FileUpload v-model="files" multiple accept="image/*" class="max-w-md">
    <FileUploadDropzone v-slot="{ dragging }" class="min-h-40">
      <span class="font-medium">{{ dragging ? 'Release to add photos' : 'Add photos' }}</span>
      <span class="text-xs text-muted-foreground">{{ files.length }} selected</span>
    </FileUploadDropzone>
  </FileUpload>
`,
	}),
};

export const InNativeForm: Story = {
	render: () => ({
		components,
		setup() {
			const files = ref<File[]>([]);
			const submitted = ref<string[]>([]);

			function onSubmit(event: SubmitEvent) {
				const data = new FormData(event.target as HTMLFormElement);
				submitted.value = data.getAll('documents').map(entry => (entry as File).name).filter(Boolean);
			}

			return { files, submitted, onSubmit };
		},
		template: `
  <form class="flex max-w-md flex-col gap-3" @submit.prevent="onSubmit">
    <FileUpload v-model="files" name="documents" multiple>
      <FileUploadDropzone />
    </FileUpload>
    <Button type="submit" class="self-start">Submit</Button>
    <p class="text-sm text-muted-foreground">FormData documents: {{ submitted.join(', ') || '—' }}</p>
  </form>
`,
	}),
};

export const Disabled: Story = {
	args: { disabled: true },
};
