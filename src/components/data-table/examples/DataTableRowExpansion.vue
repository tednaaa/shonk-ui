<script setup lang="ts">
import type { BadgeVariants, DataTableColumn, DataTableExpandedState, DataTableInstance } from 'shonk-ui';
import { Badge, DataTable, expandColumn, useDataTable } from 'shonk-ui';
import { computed, h, ref } from 'vue';

type OrderStatus = 'delivered' | 'pending' | 'returned';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  orders: Order[];
  ordersTable: DataTableInstance<Order>;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const statusVariants: Record<OrderStatus, BadgeVariants['variant']> = { delivered: 'default', pending: 'secondary', returned: 'destructive' };

const orderColumns: DataTableColumn<Order>[] = [
  { accessorKey: 'id', header: 'Id', sortable: true },
  { accessorKey: 'customer', header: 'Customer', sortable: true },
  { accessorKey: 'date', header: 'Date', sortable: true },
  { accessorKey: 'amount', header: 'Amount', cell: ({ value }) => currency.format(value), sortable: true, class: 'text-right tabular-nums', headerClass: 'text-right' },
  { accessorKey: 'status', header: 'Status', cell: ({ value }) => h(Badge, { variant: statusVariants[value] }, () => value) },
];

const customers = ['David James', 'Leon Rodrigues', 'Juan Alejandro', 'Claire Morrow', 'Mia Stone'];
const statuses: OrderStatus[] = ['delivered', 'pending', 'returned'];

const catalog = [
  { name: 'Bamboo Watch', category: 'Accessories', price: 65 },
  { name: 'Black Watch', category: 'Accessories', price: 72 },
  { name: 'Blue Band', category: 'Fitness', price: 79 },
  { name: 'Blue T-Shirt', category: 'Clothing', price: 29 },
  { name: 'Bracelet', category: 'Accessories', price: 15 },
  { name: 'Brown Purse', category: 'Accessories', price: 120 },
  { name: 'Chakra Bracelet', category: 'Accessories', price: 32 },
  { name: 'Galaxy Earrings', category: 'Accessories', price: 34 },
];

const products: Product[] = catalog.map((item, productIndex) => {
  const orders = Array.from({ length: (productIndex + 1) % 4 }, (_, orderIndex): Order => ({
    id: String(1000 + productIndex * 10 + orderIndex),
    customer: customers[(productIndex + orderIndex) % customers.length] ?? '',
    date: `2026-0${orderIndex + 1}-${10 + productIndex}`,
    amount: item.price * (orderIndex + 1),
    status: statuses[(productIndex + orderIndex) % statuses.length] ?? 'pending',
  }));

  return {
    id: String(productIndex + 1),
    ...item,
    orders,
    ordersTable: useDataTable({ data: orders, columns: orderColumns, getRowId: order => order.id }),
  };
});

const columns: DataTableColumn<Product>[] = [
  expandColumn(),
  { accessorKey: 'name', header: 'Name', class: 'font-medium' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'price', header: 'Price', cell: ({ value }) => currency.format(value), class: 'text-right tabular-nums', headerClass: 'text-right' },
  { id: 'orders', header: 'Orders', accessorFn: product => product.orders.length, class: 'text-right tabular-nums', headerClass: 'text-right' },
];

const expanded = ref<DataTableExpandedState>({});

const expandedNames = computed(() => products.filter(product => expanded.value[product.id]).map(product => product.name));

const table = useDataTable({
  data: products,
  columns,
  getRowId: product => product.id,
  expanded,
  getRowCanExpand: product => product.orders.length > 0,
});
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      The header button expands every product with orders, products without orders cannot expand.

      <br>

      Expanded: {{ expandedNames.join(', ') || 'none' }}.
    </p>

    <DataTable :table="table">
      <template #expanded="{ row }">
        <div class="flex flex-col gap-2 p-2">
          <h3 class="text-sm font-medium">
            Orders for {{ row.name }}
          </h3>
          <DataTable :table="row.ordersTable" />
        </div>
      </template>
    </DataTable>
  </div>
</template>
