<script setup lang="ts">
import type { DataTableColumn } from 'shonk-ui';
import { Badge, Button, DataTable, DataTableColumnToggle, useDataTable, useStoredColumnVisibility } from 'shonk-ui';
import { computed, h } from 'vue';

interface Lead {
  id: string;
  phone: string;
  site: string;
  geo: string;
  manager: string;
  archived: boolean;
}

const sites = ['acme.com', 'globex.com', 'initech.com'];
const geos = ['Moscow', 'Kazan', 'Samara'];
const managers = ['Ada', 'Grace', 'Linus'];

const leads: Lead[] = Array.from({ length: 6 }, (_, index) => ({
  id: String(index + 1),
  phone: `+1 555 ${String(index).padStart(4, '0')}`,
  site: sites[index % sites.length] ?? '',
  geo: geos[index % geos.length] ?? '',
  manager: managers[index % managers.length] ?? '',
  archived: index % 3 === 2,
}));

const columns: DataTableColumn<Lead>[] = [
  { accessorKey: 'phone', header: 'Phone', hideable: false, class: 'whitespace-nowrap' },
  { accessorKey: 'site', header: 'Site' },
  { accessorKey: 'geo', header: 'Geo' },
  { accessorKey: 'manager', header: 'Manager' },
  {
    accessorKey: 'archived',
    header: 'Status',
    cell: ({ value }) => h(Badge, { variant: value ? 'secondary' : 'default' }, () => (value ? 'Archived' : 'Active')),
  },
];

const storageKey = 'shonk-ui-example-lead-columns';

const columnVisibility = useStoredColumnVisibility(storageKey, columns);

const hiddenColumnIds = computed(() => Object.keys(columnVisibility.value).filter(id => columnVisibility.value[id] === false));

const table = useDataTable({ data: leads, columns, getRowId: lead => lead.id, columnVisibility });

function showEveryColumn() {
  columnVisibility.value = Object.fromEntries(Object.keys(columnVisibility.value).map(id => [id, true]));
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-4">
    <div class="flex min-h-8 items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        Hidden columns survive a reload: they are kept in localStorage under <code>{{ storageKey }}</code>.
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          :disabled="hiddenColumnIds.length === 0"
          @click="showEveryColumn"
        >
          Show all
        </Button>
        <DataTableColumnToggle :table="table" />
      </div>
    </div>

    <DataTable :table="table" />
  </div>
</template>
