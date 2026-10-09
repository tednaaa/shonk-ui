<script setup lang="ts" generic="TData extends object">
import type { Column } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { injectDataTableColumnSizing } from './lib/columnSizing';

defineProps<{
	column: Column<KitFeatures, TData, unknown>;
}>();

const { contentStyle } = injectDataTableColumnSizing();
</script>

<template>
	<div
		v-if="column.getCanResize()"
		class="truncate"
		:style="contentStyle(column.id)"
	>
		<slot />
	</div>
	<slot v-else />
</template>
