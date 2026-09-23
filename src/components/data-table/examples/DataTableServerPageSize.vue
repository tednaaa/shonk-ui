<script setup lang="ts">
import type { DataTableColumn, DataTablePaginationState, DataTableSortingState } from 'shonk-ui';
import { DataTable, DataTablePagination, DataTablePaginationPages, DataTablePaginationPageSizeSelect, useDataTable } from 'shonk-ui';
import { computed, ref, watch } from 'vue';

interface Call {
  id: string;
  phone: string;
  site: string;
  duration: number;
}

interface CallsQuery {
  ordering: string;
  limit: number;
  offset: number;
}

interface CallsPage {
  count: number;
  results: Call[];
}

const sites = ['acme.com', 'globex.com', 'initech.com', 'hooli.com', 'umbrella.com'];

const serverCalls: Call[] = Array.from({ length: 137 }, (_, index) => ({
  id: String(index + 1),
  phone: `+1 555 ${String(index).padStart(4, '0')}`,
  site: sites[index % sites.length] ?? '',
  duration: (index * 53) % 600 + 5,
}));

function fetchCalls({ ordering, limit, offset }: CallsQuery): Promise<CallsPage> {
  const direction = ordering.startsWith('-') ? -1 : 1;
  const sorted = ordering === '' ? serverCalls : serverCalls.toSorted((first, second) => (first.duration - second.duration) * direction);
  const page = { count: sorted.length, results: sorted.slice(offset, offset + limit) };

  return new Promise(resolve => setTimeout(resolve, 600, page));
}

const columns: DataTableColumn<Call>[] = [
  { accessorKey: 'phone', header: 'Callback number' },
  { accessorKey: 'site', header: 'Site' },
  {
    accessorKey: 'duration',
    header: 'Duration',
    class: 'text-right tabular-nums',
    headerClass: 'text-right',
    sortable: true,
    cell: ({ value }) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`,
  },
];

const sorting = ref<DataTableSortingState>([]);
const pagination = ref<DataTablePaginationState>({ pageIndex: 0, pageSize: 20 });

const query = computed<CallsQuery>(() => ({
  ordering: sorting.value.map(({ id, desc }) => (desc ? `-${id}` : id)).join(','),
  limit: pagination.value.pageSize,
  offset: pagination.value.pageIndex * pagination.value.pageSize,
}));

const calls = ref<Call[]>([]);
const count = ref(0);
const loading = ref(false);

watch(query, async (value, _, onCleanup) => {
  let stale = false;
  onCleanup(() => {
    stale = true;
  });

  loading.value = true;
  const page = await fetchCalls(value);

  if (stale)
    return;

  calls.value = page.results;
  count.value = page.count;
  loading.value = false;
}, { immediate: true });

const table = useDataTable({
  data: calls,
  columns,
  getRowId: call => call.id,
  serverSide: true,
  totalRowCount: count,
  sorting,
  pagination,
});
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Sorting and a new page size go back to the first page. Request: <code>?ordering={{ query.ordering }}&limit={{ query.limit }}&offset={{ query.offset }}</code>
    </p>

    <DataTable
      :table="table"
      :loading="loading"
      class="max-h-120"
    />

    <DataTablePagination :table="table">
      <DataTablePaginationPages />
      <DataTablePaginationPageSizeSelect :options="[10, 20, 50]" />
    </DataTablePagination>
  </div>
</template>
