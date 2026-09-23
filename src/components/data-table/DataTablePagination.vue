<script setup lang="ts" generic="TData extends object">
import type { HTMLAttributes } from 'vue';
import type { DataTableInstance } from './types';
import { computed, ref } from 'vue';
import { cn } from '@/utils';
import { unwrapDataTable } from './lib/instance';
import { provideDataTablePaginationContext } from './lib/paginationContext';

const props = defineProps<{
  table: DataTableInstance<TData>;
  class?: HTMLAttributes['class'];
}>();

const kitTable = computed(() => unwrapDataTable(props.table));
const pagination = computed(() => kitTable.value.atoms.pagination.get());
const rowCount = computed(() => kitTable.value.getRowCount());
const pageSizeOptions = ref<readonly number[]>([]);

const smallestPageSize = computed(() => Math.min(pagination.value.pageSize, ...pageSizeOptions.value));
const allRowsFitOnePage = computed(() => rowCount.value <= smallestPageSize.value);

provideDataTablePaginationContext({
  page: computed(() => pagination.value.pageIndex + 1),
  pageSize: computed(() => pagination.value.pageSize),
  rowCount,
  pageSizeOptions,
  goToPage: page => kitTable.value.setPageIndex(page - 1),
  changePageSize: pageSize => kitTable.value.setPagination({ pageIndex: 0, pageSize }),
});
</script>

<template>
  <div
    v-show="!allRowsFitOnePage"
    data-slot="data-table-pagination"
    :class="cn('flex flex-wrap items-center justify-center gap-x-6 gap-y-2', props.class)"
  >
    <slot />
  </div>
</template>
