<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ChevronLeftIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { useSidebar } from './utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	ariaLabel?: string;
}>();

const locale = useLocale();

const toggleLabel = computed(() => props.ariaLabel ?? locale.value.sidebar.toggleAriaLabel);

const { toggleSidebar } = useSidebar();
</script>

<template>
	<Button
		data-sidebar="toggle-button"
		data-slot="sidebar-toggle-button"
		variant="secondary"
		size="icon-xs"
		:aria-label="toggleLabel"
		:title="toggleLabel"
		:class="cn(
			'absolute top-1/2 z-20 hidden -translate-y-1/2 rounded-full shadow-sm sm:inline-flex',
			'group-data-[side=left]:-right-4 group-data-[side=right]:-left-4',
			props.class,
		)"
		@click="toggleSidebar"
	>
		<ChevronLeftIcon
			class="size-5 transition-transform [[data-side=left][data-state=collapsed]_&]:rotate-180 [[data-side=right][data-state=expanded]_&]:rotate-180"
		/>
	</Button>
</template>
