import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue';
import type { PartialShonkLocale, ShonkLocale } from './types';
import { computed, inject, provide, toValue } from 'vue';
import { en } from './en';

export const localeInjectionKey = Symbol('shonk-ui-locale') as InjectionKey<ComputedRef<ShonkLocale>>;

function mergeLocale(base: ShonkLocale, overrides: PartialShonkLocale = {}): ShonkLocale {
	const resolved: ShonkLocale = { ...base, intlLocale: overrides.intlLocale ?? base.intlLocale };

	for (const key of Object.keys(base) as Array<keyof ShonkLocale>) {
		if (key === 'intlLocale')
			continue;

		Object.assign(resolved, { [key]: { ...base[key], ...overrides[key] } });
	}

	return resolved;
}

export function resolveLocale(overrides: PartialShonkLocale = {}): ShonkLocale {
	return mergeLocale(en, overrides);
}

export function provideLocale(overrides: MaybeRefOrGetter<PartialShonkLocale | undefined>): ComputedRef<ShonkLocale> {
	const provided = inject(localeInjectionKey, null);
	const locale = computed(() => mergeLocale(provided?.value ?? en, toValue(overrides)));

	provide(localeInjectionKey, locale);

	return locale;
}

export function useLocale(overrides?: MaybeRefOrGetter<PartialShonkLocale | undefined>): ComputedRef<ShonkLocale> {
	if (overrides !== undefined)
		return provideLocale(overrides);

	const provided = inject(localeInjectionKey, null);

	return computed(() => provided?.value ?? en);
}
