<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { ShonkLocale } from '@/locales';
import { onUnmounted, watchEffect } from 'vue';
import { useLocale } from '@/locales';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { useDataTablePagination } from './lib/paginationContext';

const props = defineProps<{
	options: number[];
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['dataTable']>;
}>();

const locale = useLocale(() => ({ dataTable: props.locale }));

const { pageSize, pageSizeOptions, changePageSize } = useDataTablePagination();

watchEffect(() => {
	pageSizeOptions.value = props.options;
});

onUnmounted(() => {
	pageSizeOptions.value = [];
});
</script>

<template>
	<Select
		:model-value="pageSize"
		@update:model-value="changePageSize"
	>
		<SelectTrigger
			size="sm"
			:aria-label="locale.dataTable.pageSizeLabel"
			:class="props.class"
		>
			<SelectValue />
		</SelectTrigger>
		<SelectContent>
			<SelectItem
				v-for="option in options"
				:key="option"
				:value="option"
			>
				{{ option }}
			</SelectItem>
		</SelectContent>
	</Select>
</template>
