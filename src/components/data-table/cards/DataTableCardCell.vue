<script setup lang="ts">
import type { FunctionalComponent, Slot } from 'vue';
import { FlexRender } from '@tanstack/vue-table';
import { computed } from 'vue';
import { useCard } from './cardsContext';

const props = defineProps<{
	column: string;
}>();

const card = useCard();

const cell = computed(() => card.cell(props.column));

const slot = computed(() => card.slots[`cell-${props.column}`]);

const SlotOutlet: FunctionalComponent<{ render: Slot; context: Record<string, unknown> }> = ({ render, context }) => render(context);
</script>

<template>
	<template v-if="cell">
		<SlotOutlet
			v-if="slot"
			:render="slot"
			:context="{ row: cell.row.original, value: cell.getValue() }"
		/>
		<FlexRender
			v-else
			:cell="cell"
		/>
	</template>
</template>
