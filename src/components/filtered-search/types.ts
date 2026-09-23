import type { Component } from 'vue';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOperator {
  value: string;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  operators: FilterOperator[];
  icon?: Component;
  editor?: Component;
  options?: FilterOption[];
  multiSelect?: boolean;
  unique?: boolean;
}

export interface ActiveFilter {
  id: string;
  key: string;
  keyLabel: string;
  operator: string;
  operatorLabel: string;
  value: string | string[];
  valueLabel: string;
}

export interface FilterHistoryItem {
  filters: ActiveFilter[];
  searchText?: string;
}
