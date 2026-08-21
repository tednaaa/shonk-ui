import type { App, MaybeRefOrGetter, Plugin } from 'vue';
import type { PartialShonkLocale } from './locales';
import { computed, toValue } from 'vue';
import { localeInjectionKey, resolveLocale } from './locales';

export interface ShonkUIOptions {
  locale?: MaybeRefOrGetter<PartialShonkLocale>;
}

export const shonkUI: Plugin<[options?: ShonkUIOptions]> = {
  install(app: App, options: ShonkUIOptions = {}) {
    app.provide(localeInjectionKey, computed(() => resolveLocale(toValue(options.locale))));
  },
};
