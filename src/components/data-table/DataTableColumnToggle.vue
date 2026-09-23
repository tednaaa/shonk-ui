<script setup lang="ts" generic="TData extends object">
import type { Column } from '@tanstack/vue-table';
import type { AcceptableValue } from 'reka-ui';
import type { VNodeChild } from 'vue';
import type { KitFeatures } from './lib/features';
import type { DataTableInstance } from './types';
import { Columns3Icon } from '@lucide/vue';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { unwrapDataTable } from './lib/instance';

const props = defineProps<{
  table: DataTableInstance<TData>;
}>();

defineSlots<{
  trigger?: () => VNodeChild;
}>();

const open = defineModel<boolean>('open', { default: false });

const locale = useLocale();

const kitTable = computed(() => unwrapDataTable(props.table));

const hideableColumns = computed(() => kitTable.value.getAllLeafColumns().filter(column => column.getCanHide()));

const visibleColumnIds = computed(() => hideableColumns.value.filter(column => column.getIsVisible()).map(column => column.id));

const allColumnsVisible = computed(() => visibleColumnIds.value.length === hideableColumns.value.length);

function columnLabel(column: Column<KitFeatures, TData>) {
  return column.columnDef.meta?.label ?? column.id;
}

function isLastVisibleColumn(column: Column<KitFeatures, TData>) {
  return visibleColumnIds.value.length === 1 && column.getIsVisible();
}

function showOnlyColumns(columnIds: AcceptableValue) {
  const visibleIds = Array.isArray(columnIds) ? columnIds : [];

  kitTable.value.setColumnVisibility(visibility => ({
    ...visibility,
    ...Object.fromEntries(hideableColumns.value.map(column => [column.id, visibleIds.includes(column.id)])),
  }));
}

function showAllColumns() {
  showOnlyColumns(hideableColumns.value.map(column => column.id));
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <Button variant="secondary">
          <Columns3Icon />
          {{ locale.dataTable.columnToggleButtonText }}
        </Button>
      </slot>
    </PopoverTrigger>

    <PopoverContent
      align="end"
      class="w-64 p-0"
    >
      <Command
        :model-value="visibleColumnIds"
        multiple
        highlight-on-hover
        @update:model-value="showOnlyColumns"
      >
        <CommandInput :placeholder="locale.dataTable.columnToggleSearchPlaceholder" />
        <CommandList>
          <CommandEmpty>{{ locale.dataTable.columnToggleEmptyText }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="column in hideableColumns"
              :key="column.id"
              :value="column.id"
              :disabled="isLastVisibleColumn(column)"
            >
              <Checkbox
                :model-value="column.getIsVisible()"
                tabindex="-1"
                aria-hidden="true"
                class="pointer-events-none"
              />
              {{ columnLabel(column) }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>

      <div class="flex items-center justify-between gap-2 border-t py-1 pr-1 pl-3">
        <span class="text-xs text-muted-foreground tabular-nums">
          {{ locale.dataTable.columnToggleVisibleCountText(visibleColumnIds.length, hideableColumns.length) }}
        </span>
        <Button
          variant="ghost"
          size="sm"
          :disabled="allColumnsVisible"
          @click="showAllColumns"
        >
          {{ locale.dataTable.columnToggleShowAllButtonText }}
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
