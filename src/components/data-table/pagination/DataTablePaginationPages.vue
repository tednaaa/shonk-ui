<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from '@lucide/vue';
import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
import { cn } from '@/utils';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
} from '../../pagination';
import { useDataTablePagination } from './paginationContext';

const props = withDefaults(defineProps<{
	variant?: 'default' | 'compact';
	class?: HTMLAttributes['class'];
}>(), {
	variant: 'default',
});

const pageRangeByVariant = {
	default: { siblingCount: 1, showEdges: true },
	compact: { siblingCount: 2, showEdges: false },
};

const phoneScreen = useMediaQuery('(width < 40rem)');

const pageRange = computed(() => {
	const range = pageRangeByVariant[props.variant];

	return phoneScreen.value ? { ...range, siblingCount: range.siblingCount - 1 } : range;
});

const { page, pageSize, rowCount, goToPage } = useDataTablePagination();
</script>

<template>
	<Pagination
		#default="{ page: currentPage }"
		v-bind="pageRange"
		:page="page"
		:total="rowCount"
		:items-per-page="pageSize"
		:class="cn('mx-0 w-auto', props.class)"
		@update:page="goToPage"
	>
		<PaginationContent #default="{ items }">
			<template v-if="variant === 'compact'">
				<PaginationFirst size="icon">
					<ChevronsLeftIcon />
				</PaginationFirst>
				<PaginationPrevious size="icon">
					<ChevronLeftIcon />
				</PaginationPrevious>
			</template>
			<PaginationPrevious v-else />

			<template
				v-for="(item, index) in items"
				:key="index"
			>
				<PaginationItem
					v-if="item.type === 'page'"
					:value="item.value"
					:is-active="item.value === currentPage"
				>
					{{ item.value }}
				</PaginationItem>
				<PaginationEllipsis v-else />
			</template>

			<template v-if="variant === 'compact'">
				<PaginationNext size="icon">
					<ChevronRightIcon />
				</PaginationNext>
				<PaginationLast size="icon">
					<ChevronsRightIcon />
				</PaginationLast>
			</template>
			<PaginationNext v-else />
		</PaginationContent>
	</Pagination>
</template>
