import type { ComputedRef, InjectionKey } from 'vue';
import type { PartialShonkLocale, ShonkLocale } from './types';
import { computed, inject } from 'vue';
import { en } from './en';

export const localeInjectionKey = Symbol('shonk-ui-locale') as InjectionKey<ComputedRef<ShonkLocale>>;

export function resolveLocale(overrides: PartialShonkLocale = {}): ShonkLocale {
  const resolved: ShonkLocale = { ...en, intlLocale: overrides.intlLocale ?? en.intlLocale };

  for (const key of Object.keys(en) as Array<keyof ShonkLocale>) {
    if (key === 'intlLocale')
      continue;

    Object.assign(resolved, { [key]: { ...en[key], ...overrides[key] } });
  }

  return resolved;
}

export function useLocale(): ComputedRef<ShonkLocale> {
  const provided = inject(localeInjectionKey, null);

  return computed(() => provided?.value ?? en);
}
