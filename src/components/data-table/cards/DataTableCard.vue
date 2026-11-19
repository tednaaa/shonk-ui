<script setup lang="ts">
import type { HTMLAttributes, VNodeChild } from 'vue';
import { cn } from '@/utils';
import { useCard } from './cardsContext';
import DataTableCardCell from './DataTableCardCell.vue';
import DataTableCardFields from './DataTableCardFields.vue';
import DataTableCardSelect from './DataTableCardSelect.vue';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();

defineSlots<{
	default?: () => VNodeChild;
}>();

const { title, titleId, leadingActions, trailingActions } = useCard();
</script>

<template>
	<div
		data-slot="data-table-card"
		:class="cn('flex flex-col gap-2', props.class)"
	>
		<div
			data-slot="data-table-card-header"
			class="flex min-h-8 items-center gap-2 bg-background"
		>
			<DataTableCardSelect />
			<div class="flex min-w-0 flex-1 items-center gap-1 font-medium">
				<DataTableCardCell
					v-for="cell in leadingActions"
					:key="cell.id"
					:column="cell.column.id"
				/>
				<span
					:id="titleId"
					class="contents"
				>
					<DataTableCardCell
						v-for="cell in title"
						:key="cell.id"
						:column="cell.column.id"
					/>
				</span>
			</div>
			<div
				v-if="trailingActions.length > 0"
				class="flex shrink-0 items-center gap-1"
			>
				<DataTableCardCell
					v-for="cell in trailingActions"
					:key="cell.id"
					:column="cell.column.id"
				/>
			</div>
		</div>
		<DataTableCardFields />
		<slot />
	</div>
</template>
