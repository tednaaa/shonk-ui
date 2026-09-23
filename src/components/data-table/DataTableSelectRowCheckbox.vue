<script setup lang="ts" generic="TData extends object">
import type { Row } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { useLocale } from '@/locales';
import { Checkbox } from '../checkbox';

const props = defineProps<{
  row: Row<KitFeatures, TData>;
}>();

const locale = useLocale();

function toggleRow({ shiftKey }: MouseEvent) {
  props.row.getToggleSelectedHandler()({
    shiftKey,
    target: { checked: !props.row.getIsSelected() },
  });
}
</script>

<template>
  <Checkbox
    :model-value="row.getIsSelected()"
    :disabled="!row.getCanSelect()"
    :aria-label="locale.dataTable.selectRowLabel"
    @click="toggleRow"
  />
</template>
