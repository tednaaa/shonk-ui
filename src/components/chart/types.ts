import type { Component, HTMLAttributes } from 'vue';

export type ChartConfig = Record<string, {
  label?: string;
  icon?: Component;
  color?: string;
}>;

export interface ChartTooltipContentProps {
  payload: object;
  config: ChartConfig;
  x: number | Date;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'dot' | 'line' | 'dashed';
  labelFormatter?: (x: number | Date) => string;
  valueFormatter?: (value: number) => string;
  class?: HTMLAttributes['class'];
}
