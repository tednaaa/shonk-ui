import type { AcceptableValue } from 'reka-ui';

export interface ComboboxOption<T extends AcceptableValue = AcceptableValue> {
  label: string;
  value: T;
  disabled?: boolean;
}
