<script setup lang="ts" generic="TData extends object">
import type { Row } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { KitFeatures } from '../core/features';
import { ref } from 'vue';
import { cn } from '@/utils';
import { isInteractiveClick } from '../core/isInteractiveClick';
import { provideCardItem } from './cardsContext';

const props = defineProps<{
	row: Row<KitFeatures, TData>;
	rowClass?: (row: TData) => HTMLAttributes['class'];
	onRowClick?: (row: TData) => void;
}>();

provideCardItem(() => props.row, ref(false));

function handleClick(event: MouseEvent) {
	if (!props.onRowClick || isInteractiveClick(event))
		return;

	props.onRowClick(props.row.original);
}
</script>

<template>
	<li
		data-slot="data-table-cards-item"
		:data-state="row.getIsSelected() ? 'selected' : undefined"
		:class="cn('py-3', onRowClick && 'cursor-pointer', rowClass?.(row.original))"
		@click="handleClick"
	>
		<slot />
	</li>
</template>
