<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { UploadIcon } from '@lucide/vue';
import { useDropZone } from '@vueuse/core';
import { useTemplateRef } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { useFileUploadContext } from './context';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['fileUpload']>;
}>();

const context = useFileUploadContext();
const locale = useLocale(() => ({ fileUpload: props.locale }));

const zone = useTemplateRef('zone');
const { isOverDropZone } = useDropZone(zone, {
	checkValidity: () => !context.disabled.value,
	onDrop: files => context.addFiles(files ?? []),
});
</script>

<template>
	<div
		ref="zone"
		data-slot="file-upload-dropzone"
		role="button"
		:tabindex="context.disabled.value ? -1 : 0"
		:aria-disabled="context.disabled.value || undefined"
		:data-dragging="isOverDropZone ? '' : undefined"
		:class="cn(
			'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-field p-6 text-center text-sm transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-dragging:border-primary data-dragging:bg-primary/5',
			props.class,
		)"
		@click="context.open"
		@keydown.enter.prevent="context.open"
		@keydown.space.prevent="context.open"
	>
		<slot :dragging="isOverDropZone">
			<span class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
				<UploadIcon class="size-5" />
			</span>
			<span class="font-medium">{{ locale.fileUpload.dropzoneTitle }}</span>
			<span class="text-xs text-muted-foreground">{{ locale.fileUpload.dropzoneHint }}</span>
		</slot>
	</div>
</template>
