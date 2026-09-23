<script setup lang="ts" generic="TData extends object">
import type { Row } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { ChevronRightIcon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';

defineProps<{
  row: Row<KitFeatures, TData>;
}>();

const locale = useLocale();
</script>

<template>
  <Button
    v-if="row.getCanExpand()"
    variant="ghost"
    size="icon-xs"
    class="-my-1.5 flex"
    :aria-label="locale.dataTable.expandRowLabel"
    :aria-expanded="row.getIsExpanded()"
    @click="row.toggleExpanded()"
  >
    <ChevronRightIcon :class="cn('transition-transform', row.getIsExpanded() && 'rotate-90')" />
  </Button>
</template>
