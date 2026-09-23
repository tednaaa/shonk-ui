<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { Badge, DataTable, useDataTable } from 'shonk-ui';
import { h, ref } from 'vue';

interface Order {
  id: string;
  number: string;
  client: string;
  niche: string;
  sitesCount: number;
  collectionDate: string;
}

interface OrdersPage {
  next: number | null;
  results: Order[];
}

const PAGE_SIZE = 20;

const clients = ['Acme Corp', 'Globex', 'Initech', 'Hooli', 'Umbrella'];
const niches = ['Real estate', 'Dentistry', 'Car service', 'Legal'];

const serverOrders: Order[] = Array.from({ length: 95 }, (_, index) => ({
  id: String(index + 1),
  number: `ORD-${String(index + 1).padStart(4, '0')}`,
  client: clients[index % clients.length] ?? '',
  niche: niches[index % niches.length] ?? '',
  sitesCount: (index * 7) % 30 + 1,
  collectionDate: `${String(index % 28 + 1).padStart(2, '0')}.09`,
}));

function fetchOrders(offset: number): Promise<OrdersPage> {
  const end = offset + PAGE_SIZE;
  const page = {
    next: end < serverOrders.length ? end : null,
    results: serverOrders.slice(offset, end),
  };

  return new Promise(resolve => setTimeout(resolve, 800, page));
}

const columns: DataTableColumn<Order>[] = [
  { accessorKey: 'number', header: 'Order', class: 'font-medium' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'niche', header: 'Niche', cell: ({ value }) => h(Badge, () => value) },
  { accessorKey: 'sitesCount', header: 'Sites', class: 'text-right tabular-nums', headerClass: 'text-right' },
  { accessorKey: 'collectionDate', header: 'Date' },
];

const orders = ref<Order[]>([]);
const nextOffset = ref<number | null>(0);
const fetching = ref(false);

async function loadNextPage() {
  const offset = nextOffset.value;

  if (offset === null)
    return;

  fetching.value = true;
  const page = await fetchOrders(offset);

  orders.value = [...orders.value, ...page.results];
  nextOffset.value = page.next;
  fetching.value = false;
}

loadNextPage();

const table = useDataTable({ data: orders, columns, getRowId: order => order.id });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Loaded {{ orders.length }} of {{ serverOrders.length }} orders. Scrolling close to the bottom loads the next {{ PAGE_SIZE }}.
    </p>

    <DataTable
      :table="table"
      :loading="fetching && orders.length === 0"
      :has-next-page="nextOffset !== null"
      :loading-more="fetching && orders.length > 0"
      class="max-h-120"
      @load-more="loadNextPage"
    />
  </div>
</template>
