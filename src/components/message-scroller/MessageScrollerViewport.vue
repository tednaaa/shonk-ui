<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { SCROLL_KEYS, useMessageScrollerContext } from './useMessageScroller';

const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class'];
	preserveScrollOnPrepend?: boolean;
	locale?: Partial<ShonkLocale['messageScroller']>;
}>(), {
	preserveScrollOnPrepend: true,
});

const {
	autoscrolling,
	handleResize,
	scrollableAttr,
	setPreserveScrollOnPrepend,
	setViewportElement,
	syncAfterScroll,
	userScrollIntent,
} = useMessageScrollerContext();

const locale = useLocale(() => ({ messageScroller: props.locale }));

const viewportEl = useTemplateRef<HTMLElement>('viewport');

watch(() => props.preserveScrollOnPrepend, setPreserveScrollOnPrepend, { immediate: true });

function onKeyDown(event: KeyboardEvent) {
	if (SCROLL_KEYS.has(event.key))
		userScrollIntent();
}

let resizeObserver: ResizeObserver | null = null;
let resizeFrame = 0;

onMounted(() => {
	const viewport = viewportEl.value;
	setViewportElement(viewport);
	if (!viewport || typeof ResizeObserver === 'undefined')
		return;
	resizeObserver = new ResizeObserver(() => {
		window.cancelAnimationFrame(resizeFrame);
		resizeFrame = window.requestAnimationFrame(handleResize);
	});
	resizeObserver.observe(viewport);
});

onBeforeUnmount(() => {
	window.cancelAnimationFrame(resizeFrame);
	resizeObserver?.disconnect();
	resizeObserver = null;
	setViewportElement(null);
});
</script>

<template>
	<div
		ref="viewport"
		data-slot="message-scroller-viewport"
		role="region"
		:aria-label="locale.messageScroller.viewportAriaLabel"
		:tabindex="0"
		:data-scrollable="scrollableAttr"
		:data-autoscrolling="autoscrolling ? '' : undefined"
		:class="cn(
			'size-full min-h-0 min-w-0 scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent',
			props.class,
		)"
		@scroll="syncAfterScroll()"
		@wheel="userScrollIntent()"
		@touchmove="userScrollIntent()"
		@keydown="onKeyDown"
	>
		<slot />
	</div>
</template>
