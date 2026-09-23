<script setup lang="ts">
import type { DataTableColumn, DataTableSortingState } from 'shonk-ui';
import { DataTable, useDataTable } from 'shonk-ui';
import { computed, ref, watch } from 'vue';

interface Deal {
  id: string;
  client: string;
  manager: string;
  amount: number;
}

const serverDeals: Deal[] = [
  { id: '1', client: 'Umbrella', manager: 'Grace', amount: 450 },
  { id: '2', client: 'Globex', manager: 'Alan', amount: 150 },
  { id: '3', client: 'Initech', manager: 'Grace', amount: 350 },
  { id: '4', client: 'Acme Corp', manager: 'Alan', amount: 450 },
  { id: '5', client: 'Hooli', manager: 'Ada', amount: 150 },
  { id: '6', client: 'Stark Industries', manager: 'Ada', amount: 900 },
];

const compareDeals: Record<string, (first: Deal, second: Deal) => number> = {
  client: (first, second) => first.client.localeCompare(second.client),
  manager: (first, second) => first.manager.localeCompare(second.manager),
  amount: (first, second) => first.amount - second.amount,
};

function fetchDeals(ordering: string): Promise<Deal[]> {
  const fields = ordering.split(',').filter(Boolean);
  const sorted = serverDeals.toSorted((first, second) => {
    for (const field of fields) {
      const desc = field.startsWith('-');
      const difference = compareDeals[desc ? field.slice(1) : field]?.(first, second) ?? 0;

      if (difference !== 0)
        return desc ? -difference : difference;
    }

    return 0;
  });

  return new Promise(resolve => setTimeout(resolve, 600, sorted));
}

const columns: DataTableColumn<Deal>[] = [
  { accessorKey: 'client', header: 'Client', sortable: true },
  { accessorKey: 'manager', header: 'Manager', sortable: true },
  { accessorKey: 'amount', header: 'Amount', class: 'text-right', headerClass: 'text-right', sortable: true },
];

const sorting = ref<DataTableSortingState>([{ id: 'manager', desc: false }]);
const ordering = computed(() => sorting.value.map(({ id, desc }) => (desc ? `-${id}` : id)).join(','));

const deals = ref<Deal[]>([]);
const loading = ref(false);

watch(ordering, async (value, _, onCleanup) => {
  let stale = false;
  onCleanup(() => {
    stale = true;
  });

  loading.value = true;
  const sortedDeals = await fetchDeals(value);

  if (stale)
    return;

  deals.value = sortedDeals;
  loading.value = false;
}, { immediate: true });

const table = useDataTable({
  data: deals,
  columns,
  serverSide: true,
  sorting,
  enableMultiSort: true,
});
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Shift+click a header to add it to the sorting. Request: <code>?ordering={{ ordering }}</code>
    </p>

    <DataTable
      :table="table"
      :loading="loading"
    />
  </div>
</template>
