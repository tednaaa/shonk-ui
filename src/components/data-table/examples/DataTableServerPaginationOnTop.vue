<script setup lang="ts">
import type { DataTableColumn, DataTablePaginationState } from 'shonk-ui';
import { DataTable, DataTablePagination, DataTablePaginationPages, useDataTable } from 'shonk-ui';
import { computed, ref, watch } from 'vue';

interface Operation {
  id: string;
  description: string;
  amount: number;
}

interface OperationsPage {
  count: number;
  results: Operation[];
}

const descriptions = ['Balance top-up', 'Lead purchase', 'Refund', 'Subscription'];

const serverOperations: Operation[] = Array.from({ length: 42 }, (_, index) => ({
  id: `OP-${1000 + index}`,
  description: descriptions[index % descriptions.length] ?? '',
  amount: ((index * 37) % 90 + 10) * 10,
}));

function fetchOperations(limit: number, offset: number): Promise<OperationsPage> {
  const page = { count: serverOperations.length, results: serverOperations.slice(offset, offset + limit) };

  return new Promise(resolve => setTimeout(resolve, 600, page));
}

const columns: DataTableColumn<Operation>[] = [
  { accessorKey: 'id', header: 'Operation' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'amount', header: 'Amount', class: 'text-right', headerClass: 'text-right' },
];

const pagination = ref<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 });
const limit = computed(() => pagination.value.pageSize);
const offset = computed(() => pagination.value.pageIndex * pagination.value.pageSize);

const operations = ref<Operation[]>([]);
const count = ref(0);
const loading = ref(false);

watch([limit, offset], async ([limitValue, offsetValue], _, onCleanup) => {
  let stale = false;
  onCleanup(() => {
    stale = true;
  });

  loading.value = true;
  const page = await fetchOperations(limitValue, offsetValue);

  if (stale)
    return;

  operations.value = page.results;
  count.value = page.count;
  loading.value = false;
}, { immediate: true });

const table = useDataTable({
  data: operations,
  columns,
  serverSide: true,
  totalRowCount: count,
  pagination,
});
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Request: <code>?limit={{ limit }}&offset={{ offset }}</code>
    </p>

    <DataTablePagination :table="table">
      <DataTablePaginationPages />
    </DataTablePagination>

    <DataTable
      :table="table"
      :loading="loading"
    />
  </div>
</template>
