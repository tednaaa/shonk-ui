<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { DataTable, useDataTable } from 'shonk-ui';

interface Customer {
  id: string;
  representative: string;
  name: string;
  country: string;
  company: string;
}

const accounts = [
  { representative: 'Amy Elsner', name: 'James Butt', country: 'Algeria', company: 'Benton, John B Jr' },
  { representative: 'Amy Elsner', name: 'Josephine Darakjy', country: 'Egypt', company: 'Chanay, Jeffrey A Esq' },
  { representative: 'Amy Elsner', name: 'Art Venere', country: 'Panama', company: 'Chemel, James L Cpa' },
  { representative: 'Anna Fali', name: 'Lenna Paprocki', country: 'Slovenia', company: 'Feltz Printing Service' },
  { representative: 'Anna Fali', name: 'Donette Foller', country: 'South Africa', company: 'Printing Dimensions' },
  { representative: 'Asiya Javayant', name: 'Simona Morasca', country: 'Egypt', company: 'Chapman, Ross E Esq' },
  { representative: 'Asiya Javayant', name: 'Mitsue Tollner', country: 'Paraguay', company: 'Morlong Associates' },
  { representative: 'Asiya Javayant', name: 'Leota Dilliard', country: 'Serbia', company: 'Commercial Press' },
  { representative: 'Asiya Javayant', name: 'Sage Wieser', country: 'Egypt', company: 'Truhlar And Truhlar Attys' },
  { representative: 'Bernardo Dominic', name: 'Kris Marrier', country: 'Mexico', company: 'King, Christopher A Esq' },
  { representative: 'Bernardo Dominic', name: 'Minna Amigon', country: 'Romania', company: 'Dorl, James J Esq' },
  { representative: 'Ioni Bowcher', name: 'Abel Maclead', country: 'Singapore', company: 'Rangoni Of Florence' },
  { representative: 'Ioni Bowcher', name: 'Kiley Caldarera', country: 'Serbia', company: 'Feiner Bros' },
  { representative: 'Ioni Bowcher', name: 'Graciela Ruta', country: 'Chile', company: 'Buckley Miller & Wright' },
];

const customers: Customer[] = accounts.map((account, index) => ({ id: String(index + 1), ...account }));

const columns: DataTableColumn<Customer>[] = [
  { accessorKey: 'representative', header: 'Representative', spanRows: true, sortable: true, class: 'font-medium' },
  { accessorKey: 'name', header: 'Name', sortable: true },
  { accessorKey: 'country', header: 'Country' },
  { accessorKey: 'company', header: 'Company' },
];

const table = useDataTable({ data: customers, columns, getRowId: customer => customer.id });
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      Neighbouring rows with the same representative share one cell.

      <br>

      Merging follows the order of the rows: sorting by representative keeps the groups, sorting by name breaks them apart.
    </p>

    <DataTable :table="table" />
  </div>
</template>
