<script setup lang="ts" generic="TData extends object">
import type { Table } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { ChevronRightIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';

const props = defineProps<{
  table: Table<KitFeatures, TData>;
}>();

const locale = useLocale();

const allRowsExpanded = computed(() => props.table.getIsAllRowsExpanded());
</script>

<template>
  <Button
    variant="ghost"
    size="icon-xs"
    :disabled="!table.getCanSomeRowsExpand()"
    :aria-label="allRowsExpanded ? locale.dataTable.collapseAllRowsLabel : locale.dataTable.expandAllRowsLabel"
    @click="table.toggleAllRowsExpanded()"
  >
    <ChevronRightIcon :class="cn('transition-transform', allRowsExpanded && 'rotate-90')" />
  </Button>
</template>
