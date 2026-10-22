<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { PanelLeft } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { useSidebar } from './utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['sidebar']>;
}>();

const locale = useLocale(() => ({ sidebar: props.locale }));

const { toggleSidebar } = useSidebar();
</script>

<template>
	<Button
		data-sidebar="trigger"
		data-slot="sidebar-trigger"
		variant="ghost"
		size="icon"
		:class="cn('size-7', props.class)"
		@click="toggleSidebar"
	>
		<PanelLeft />
		<span class="sr-only">{{ locale.sidebar.toggleAriaLabel }}</span>
	</Button>
</template>
