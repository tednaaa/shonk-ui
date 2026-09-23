<script setup lang="ts">
import type { DataTableColumn, DataTableRowPinningState } from 'shonk-ui';
import { ArrowDownToLineIcon, ArrowUpToLineIcon, PinOffIcon } from '@lucide/vue';
import { Button, DataTable, useDataTable } from 'shonk-ui';
import { ref } from 'vue';

interface Customer {
  id: string;
  name: string;
  country: string;
  company: string;
  balance: number;
}

type PinPosition = keyof DataTableRowPinningState | false;

const people = [
  { name: 'James Butt', country: 'Algeria', company: 'Benton, John B Jr' },
  { name: 'Josephine Darakjy', country: 'Egypt', company: 'Chanay, Jeffrey A Esq' },
  { name: 'Art Venere', country: 'Panama', company: 'Chemel, James L Cpa' },
  { name: 'Lenna Paprocki', country: 'Slovenia', company: 'Feltz Printing Service' },
  { name: 'Donette Foller', country: 'South Africa', company: 'Printing Dimensions' },
  { name: 'Simona Morasca', country: 'Egypt', company: 'Chapman, Ross E Esq' },
  { name: 'Mitsue Tollner', country: 'Paraguay', company: 'Morlong Associates' },
  { name: 'Leota Dilliard', country: 'Serbia', company: 'Commercial Press' },
  { name: 'Sage Wieser', country: 'Egypt', company: 'Truhlar And Truhlar Attys' },
  { name: 'Kris Marrier', country: 'Mexico', company: 'King, Christopher A Esq' },
  { name: 'Minna Amigon', country: 'Romania', company: 'Dorl, James J Esq' },
  { name: 'Abel Maclead', country: 'Singapore', company: 'Rangoni Of Florence' },
  { name: 'Kiley Caldarera', country: 'Serbia', company: 'Feiner Bros' },
  { name: 'Graciela Ruta', country: 'Chile', company: 'Buckley Miller & Wright' },
  { name: 'Cammy Albares', country: 'Philippines', company: 'Rousseaux, Michael Esq' },
  { name: 'Mattie Poquette', country: 'Venezuela', company: 'Century Communications' },
  { name: 'Meaghan Garufi', country: 'Malaysia', company: 'Bolton, Wilbur Esq' },
  { name: 'Gladys Rim', country: 'Netherlands', company: 'T M Byxbee Company Pc' },
  { name: 'Yuki Whobrey', country: 'Israel', company: 'Farmers Insurance Group' },
  { name: 'Fletcher Flosi', country: 'Argentina', company: 'Post Box Services Plus' },
];

const customers: Customer[] = people.map((person, index) => ({
  id: String(index + 1),
  ...person,
  balance: 1000 + (index * 7919) % 90000,
}));

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const numeric = { class: 'text-right tabular-nums', headerClass: 'text-right' };

const columns: DataTableColumn<Customer>[] = [
  { id: 'pin', hideable: false, class: 'w-px' },
  { accessorKey: 'name', header: 'Name', sortable: true, class: 'font-medium', footer: 'Total' },
  { accessorKey: 'country', header: 'Country', sortable: true },
  { accessorKey: 'company', header: 'Company' },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ value }) => currency.format(value),
    footer: ({ rows }) => currency.format(rows.reduce((total, customer) => total + customer.balance, 0)),
    sortable: true,
    ...numeric,
  },
];

const rowPinning = ref<DataTableRowPinningState>({ top: ['2', '6'], bottom: ['9'] });

function pinnedPosition(customer: Customer): PinPosition {
  if (rowPinning.value.top.includes(customer.id))
    return 'top';

  return rowPinning.value.bottom.includes(customer.id) ? 'bottom' : false;
}

function pin(customer: Customer, position: PinPosition) {
  const top = rowPinning.value.top.filter(id => id !== customer.id);
  const bottom = rowPinning.value.bottom.filter(id => id !== customer.id);

  rowPinning.value = {
    top: position === 'top' ? [...top, customer.id] : top,
    bottom: position === 'bottom' ? [...bottom, customer.id] : bottom,
  };
}

const table = useDataTable({ data: customers, columns, getRowId: customer => customer.id, rowPinning });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Pinned rows stay above and below the other rows while the table scrolls and sorts. The total counts every row shown.
    </p>

    <DataTable
      :table="table"
      class="max-h-120"
    >
      <template #cell-pin="{ row }">
        <div class="-my-1.5 flex">
          <Button
            v-if="pinnedPosition(row)"
            variant="ghost"
            size="icon-xs"
            aria-label="Unpin"
            @click="pin(row, false)"
          >
            <PinOffIcon />
          </Button>

          <template v-else>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Pin to top"
              @click="pin(row, 'top')"
            >
              <ArrowUpToLineIcon />
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Pin to bottom"
              @click="pin(row, 'bottom')"
            >
              <ArrowDownToLineIcon />
            </Button>
          </template>
        </div>
      </template>
    </DataTable>
  </div>
</template>
