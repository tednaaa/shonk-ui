import type { ComputedRef, Ref } from 'vue';
import { createContext } from 'reka-ui';

export const [useDataTablePagination, provideDataTablePaginationContext] = createContext<{
  page: ComputedRef<number>;
  pageSize: ComputedRef<number>;
  rowCount: ComputedRef<number>;
  pageSizeOptions: Ref<readonly number[]>;
  goToPage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
}>('DataTablePagination');
