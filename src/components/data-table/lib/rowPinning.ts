import type { Row, Table } from '@tanstack/vue-table';
import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue';
import type { KitFeatures } from './features';
import { useElementSize } from '@vueuse/core';
import { createContext } from 'reka-ui';
import { reactive, watch } from 'vue';

interface PinnedRowsInsets {
  top: number;
  bottom: number;
}

export const [injectDataTableRowPinning, provideDataTableRowPinning] = createContext<PinnedRowsInsets>('DataTable');

export function useRowPinning() {
  provideDataTableRowPinning(reactive({ top: 0, bottom: 0 }));
}

export function usePinnedRowsInset(edge: keyof PinnedRowsInsets, stickySection: MaybeRefOrGetter<ComponentPublicInstance | null>) {
  const insets = injectDataTableRowPinning();
  const { height } = useElementSize(stickySection, undefined, { box: 'border-box' });

  watch(height, (sectionHeight) => {
    insets[edge] = sectionHeight;
  }, { immediate: true });
}

export function getDisplayedRows<TData extends object>(table: Table<KitFeatures, TData>): Row<KitFeatures, TData>[] {
  return [...table.getTopRows(), ...table.getCenterRows(), ...table.getBottomRows()];
}
