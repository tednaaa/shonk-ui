import type { ShonkUIOptions } from '../plugin';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { shonkUI } from '../plugin';
import { en } from './en';
import { ru } from './ru';
import { resolveLocale, useLocale } from './useLocale';

const Probe = defineComponent({
  setup() {
    const locale = useLocale();

    return () => h('span', `${locale.value.confirmDialog.title}|${locale.value.confirmDialog.cancel}|${locale.value.code}`);
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
    expect(locale.confirmDialog.cancel).toBe(en.confirmDialog.cancel);
  });

  it('should keep untouched sections', () => {
    const locale = resolveLocale({ spinner: { loading: 'Working' } });

    expect(locale.pagination).toEqual(en.pagination);
  });

  it('should override the formatting code', () => {
    expect(resolveLocale({ code: 'de-DE' }).code).toBe('de-DE');
    expect(resolveLocale().code).toBe(en.code);
  });

  it('should not mutate the shipped locales', () => {
    resolveLocale({ dialog: { close: 'Dismiss' } });

    expect(en.dialog.close).toBe('Close');
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
