import type { Component } from 'vue';
import type { ShonkUIOptions } from '../plugin';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import Breadcrumb from '../components/breadcrumb/Breadcrumb.vue';
import Spinner from '../components/spinner/Spinner.vue';
import { shonkUI } from '../plugin';
import { en } from './en';
import { ru } from './ru';
import { resolveLocale, useLocale } from './useLocale';

const Probe = defineComponent({
  setup() {
    const locale = useLocale();

    return () => h('span', `${locale.value.confirmDialog.title}|${locale.value.confirmDialog.cancelButtonText}|${locale.value.intlLocale}`);
  },
});

function render(options?: ShonkUIOptions) {
  const host = document.createElement('div');
  const app = createApp(Probe);

  if (options)
    app.use(shonkUI, options);

  app.mount(host);

  return { host, app };
}

describe('resolveLocale', () => {
  it('should return the English defaults when nothing is overridden', () => {
    expect(resolveLocale()).toEqual(en);
  });

  it('should keep untouched keys of a section', () => {
    const locale = resolveLocale({ confirmDialog: { title: 'Are you sure?' } });

    expect(locale.confirmDialog.title).toBe('Are you sure?');
    expect(locale.confirmDialog.cancelButtonText).toBe(en.confirmDialog.cancelButtonText);
  });

  it('should keep untouched sections', () => {
    const locale = resolveLocale({ spinner: { ariaLabel: 'Working' } });

    expect(locale.pagination).toEqual(en.pagination);
  });

  it('should override the Intl locale', () => {
    expect(resolveLocale({ intlLocale: 'de-DE' }).intlLocale).toBe('de-DE');
    expect(resolveLocale().intlLocale).toBe(en.intlLocale);
  });

  it('should not mutate the shipped locales', () => {
    resolveLocale({ dialog: { closeButtonAriaLabel: 'Dismiss' } });

    expect(en.dialog.closeButtonAriaLabel).toBe('Close');
  });

  it('should accept a full locale unchanged', () => {
    expect(resolveLocale(ru)).toEqual(ru);
  });
});

describe('useLocale', () => {
  it('should fall back to English when the plugin is not installed', () => {
    const { host } = render();

    expect(host.textContent).toBe('Confirm|Cancel|en-US');
  });

  it('should read the locale the plugin provides', () => {
    const { host } = render({ locale: ru });

    expect(host.textContent).toBe('Подтверждение|Отменить|ru-RU');
  });

  it('should fill a partial locale in with English', () => {
    const { host } = render({ locale: { confirmDialog: { title: 'Погоди' } } });

    expect(host.textContent).toBe('Погоди|Cancel|en-US');
  });

  it('should follow a locale that changes at runtime', async () => {
    const locale = ref(en);
    const { host } = render({ locale });

    expect(host.textContent).toBe('Confirm|Cancel|en-US');

    locale.value = ru;
    await nextTick();

    expect(host.textContent).toBe('Подтверждение|Отменить|ru-RU');
  });
});

describe('localized components', () => {
  function mount(component: Component, props?: Record<string, unknown>) {
    const host = document.createElement('div');
    createApp(component, props).use(shonkUI, { locale: ru }).mount(host);

    return host;
  }

  it('should read a string from the locale', () => {
    const host = mount(Spinner);

    expect(host.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe('Загрузка');
  });

  it('should fall back to the locale when the prop is omitted', () => {
    const host = mount(Breadcrumb);

    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('хлебные крошки');
  });

  it('should let a prop win over the locale', () => {
    const host = mount(Breadcrumb, { ariaLabel: 'Навигация' });

    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('Навигация');
  });
});
