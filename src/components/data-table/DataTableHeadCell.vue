<script setup lang="ts" generic="TData extends object">
import type { Header, SortDirection } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/vue';
import { FlexRender } from '@tanstack/vue-table';
import { computed } from 'vue';
import { cn } from '@/utils';
import { TableHead } from '../table';
import { isInteractiveClick } from './lib/isInteractiveClick';

const props = defineProps<{
  header: Header<KitFeatures, TData, unknown>;
}>();

const ariaSortByDirection: Record<SortDirection, 'ascending' | 'descending'> = {
  asc: 'ascending',
  desc: 'descending',
};

const sortIconByDirection: Record<SortDirection, typeof ArrowUpIcon> = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
};

const label = computed(() => {
  const { columnDef } = props.header.column;

  return typeof columnDef.header === 'string' ? columnDef.header : '';
});

const sortable = computed(() => !props.header.isPlaceholder && props.header.column.getCanSort());

const direction = computed(() => props.header.column.getIsSorted());

const sortPosition = computed(() => {
  const sortedColumnCount = props.header.getContext().table.atoms.sorting.get().length;
  const sortIndex = props.header.column.getSortIndex();

  return sortedColumnCount > 1 && sortIndex >= 0 ? sortIndex + 1 : undefined;
});

function toggleSorting(event: MouseEvent | KeyboardEvent) {
  props.header.column.toggleSorting(undefined, event.shiftKey);
}

function handleClick(event: MouseEvent) {
  if (sortable.value && !isInteractiveClick(event))
    toggleSorting(event);
}
</script>

<template>
  <TableHead
    v-if="sortable"
    :colspan="header.colSpan"
    :aria-sort="direction ? ariaSortByDirection[direction] : 'none'"
    tabindex="0"
    :class="cn('cursor-pointer outline-none select-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset', header.column.columnDef.meta?.headerClass)"
    @click="handleClick"
    @keydown.enter.self.prevent="toggleSorting"
    @keydown.space.self.prevent="toggleSorting"
  >
    <span class="inline-flex items-center gap-1.5">
      <slot
        :name="`header-${header.column.id}`"
        :label="label"
      >
        <FlexRender :header="header" />
      </slot>
      <span
        aria-hidden="true"
        :class="cn('inline-flex items-center gap-0.5 text-xs tabular-nums', direction ? 'text-foreground' : 'text-muted-foreground')"
      >
        <component
          :is="direction ? sortIconByDirection[direction] : ArrowUpDownIcon"
          class="size-3.5"
        />
        {{ sortPosition }}
      </span>
    </span>
  </TableHead>
  <TableHead
    v-else
    :colspan="header.colSpan"
    :class="header.column.columnDef.meta?.headerClass"
  >
    <slot
      v-if="!header.isPlaceholder"
      :name="`header-${header.column.id}`"
      :label="label"
    >
      <FlexRender :header="header" />
    </slot>
  </TableHead>
</template>
