<script setup lang="ts">
import DataTableSelectRowCheckbox from '../row-selection/DataTableSelectRowCheckbox.vue';
import { useCard } from './cardsContext';

const { row, select, titleId } = useCard();
</script>

<template>
	<span
		v-if="select"
		data-slot="data-table-card-select"
		class="relative flex size-6 shrink-0 items-center justify-center"
	>
		<DataTableSelectRowCheckbox
			:row="row()"
			:aria-labelledby="titleId"
		/>
	</span>
</template>
