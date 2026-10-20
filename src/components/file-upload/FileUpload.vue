<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { FileRejection } from './validate';
import { Primitive } from 'reka-ui';
import { provide, toRef, useTemplateRef, watch } from 'vue';
import { cn } from '@/utils';
import { fileUploadKey } from './context';
import { mergeFiles } from './validate';

const props = withDefaults(defineProps<PrimitiveProps & {
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	maxFiles?: number;
	disabled?: boolean;
	name?: string;
	class?: HTMLAttributes['class'];
}>(), {
	as: 'div',
});

const emits = defineEmits<{
	reject: [rejections: FileRejection[]];
}>();

const files = defineModel<File[]>({ default: () => [] });

const input = useTemplateRef('input');

function addFiles(incoming: File[]) {
	if (props.disabled || incoming.length === 0)
		return;
	const result = mergeFiles(files.value, incoming, props);
	if (result.files !== files.value)
		files.value = result.files;
	if (result.rejected.length > 0)
		emits('reject', result.rejected);
}

function open() {
	if (!props.disabled)
		input.value?.click();
}

function syncInput() {
	if (!input.value || typeof DataTransfer === 'undefined')
		return;
	const transfer = new DataTransfer();
	for (const file of files.value)
		transfer.items.add(file);
	input.value.files = transfer.files;
}

function onChange(event: Event) {
	addFiles(Array.from((event.target as HTMLInputElement).files ?? []));
	syncInput();
}

watch(files, syncInput, { flush: 'post' });

provide(fileUploadKey, {
	disabled: toRef(() => props.disabled),
	open,
	addFiles,
});
</script>

<template>
	<Primitive
		data-slot="file-upload"
		:data-disabled="disabled ? '' : undefined"
		:as="as"
		:as-child="asChild"
		:class="cn('flex flex-col gap-3', props.class)"
	>
		<input
			ref="input"
			type="file"
			class="sr-only"
			tabindex="-1"
			aria-hidden="true"
			:name="name"
			:accept="accept"
			:multiple="multiple"
			:disabled="disabled"
			@change="onChange"
		>
		<slot :files="files" :open="open" />
	</Primitive>
</template>
