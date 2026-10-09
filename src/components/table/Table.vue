<script setup lang="ts">
import type { HTMLAttributes, StyleValue } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
	class?: HTMLAttributes['class'];
	tableStyle?: StyleValue;
	tableContainerClass?: HTMLAttributes['class'];
}>();
</script>

<template>
	<div data-slot="table-container" :class="cn('relative w-full overflow-auto', props.tableContainerClass)">
		<table data-slot="table" :class="cn('w-full caption-bottom bg-background text-sm', props.class)" :style="tableStyle">
			<slot />
		</table>
	</div>
</template>
