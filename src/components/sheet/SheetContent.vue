<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { XIcon } from '@lucide/vue';
import { reactiveOmit, useLocalStorage, useWindowSize } from '@vueuse/core';
import {
	DialogClose,
	DialogContent,
	DialogPortal,
	useForwardPropsEmits,
} from 'reka-ui';
import { computed, ref, shallowRef } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import SheetOverlay from './SheetOverlay.vue';
import { sheetContentVariants, sheetResizeHandleVariants } from './variants';

interface SheetContentProps extends DialogContentProps {
	class?: HTMLAttributes['class'];
	side?: 'top' | 'right' | 'bottom' | 'left';
	resizable?: boolean;
	defaultWidth?: number;
	minWidth?: number;
	maxWidth?: number;
	storageKey?: string;
	showCloseButton?: boolean;
	locale?: Partial<ShonkLocale['sheet']>;
}

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(defineProps<SheetContentProps>(), {
	side: 'right',
	defaultWidth: 384,
	minWidth: 320,
	maxWidth: Number.POSITIVE_INFINITY,
	showCloseButton: true,
});
const emits = defineEmits<DialogContentEmits>();

const KEYBOARD_STEP = 16;

const locale = useLocale(() => ({ sheet: props.locale }));

const delegatedProps = reactiveOmit(
	props,
	'class',
	'side',
	'resizable',
	'defaultWidth',
	'minWidth',
	'maxWidth',
	'storageKey',
	'showCloseButton',
	'locale',
);

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const isResizable = computed(() => props.resizable && (props.side === 'left' || props.side === 'right'));
const handleSide = computed(() => (props.side === 'left' ? 'left' : 'right'));
const direction = computed(() => (props.side === 'left' ? 1 : -1));

const storedWidth = props.storageKey ? useLocalStorage(props.storageKey, props.defaultWidth) : ref(props.defaultWidth);
const { width: viewportWidth } = useWindowSize();

const widthMax = computed(() => Math.max(props.minWidth, Math.min(props.maxWidth, viewportWidth.value)));
const width = computed(() => clampWidth(storedWidth.value));

const dragStart = shallowRef<{ x: number; width: number } | null>(null);

function clampWidth(value: number) {
	return Math.min(Math.max(Math.round(value), props.minWidth), widthMax.value);
}

function setWidth(value: number) {
	storedWidth.value = clampWidth(value);
}

function onHandleKeydown(event: KeyboardEvent) {
	if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
		return;

	event.preventDefault();
	setWidth(width.value + (event.key === 'ArrowRight' ? KEYBOARD_STEP : -KEYBOARD_STEP) * direction.value);
}

function onHandlePointerdown(event: PointerEvent) {
	if (event.button !== 0)
		return;

	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	dragStart.value = { x: event.clientX, width: width.value };
}

function onHandlePointermove(event: PointerEvent) {
	if (!dragStart.value)
		return;

	setWidth(dragStart.value.width + (event.clientX - dragStart.value.x) * direction.value);
}

function onHandlePointerup() {
	dragStart.value = null;
}
</script>

<template>
	<DialogPortal>
		<SheetOverlay />
		<DialogContent
			data-slot="sheet-content"
			:class="cn(sheetContentVariants({ side, resizable: isResizable }), dragStart && 'select-none', props.class)"
			:style="isResizable ? { '--sheet-width': `${width}px` } : undefined"
			v-bind="{ ...$attrs, ...forwarded }"
		>
			<slot />

			<div
				v-if="isResizable"
				data-slot="sheet-resize-handle"
				role="separator"
				tabindex="0"
				aria-orientation="vertical"
				:aria-label="locale.sheet.resizeHandleAriaLabel"
				:aria-valuenow="width"
				:aria-valuemin="minWidth"
				:aria-valuemax="widthMax"
				:class="cn(sheetResizeHandleVariants({ side: handleSide }), dragStart && 'after:bg-ring')"
				@keydown="onHandleKeydown"
				@pointerdown="onHandlePointerdown"
				@pointermove="onHandlePointermove"
				@pointerup="onHandlePointerup"
				@pointercancel="onHandlePointerup"
			/>

			<DialogClose
				v-if="showCloseButton"
				class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary"
			>
				<XIcon class="size-4" />
				<span class="sr-only">{{ locale.sheet.closeButtonScreenReaderText }}</span>
			</DialogClose>
		</DialogContent>
	</DialogPortal>
</template>
