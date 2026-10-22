# Localization

Text baked into components — the confirm dialog, pagination, close buttons — comes from a locale. Skip this setup and everything stays English.

## App locale

```ts
import { ru, shonkUI } from 'shonk-ui';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(shonkUI, { locale: ru }).mount('#app');
```

`en` and `ru` ship with the library. Any object of the same shape works, and a partial one falls back to `en` key by key:

```ts
app.use(shonkUI, {
	locale: {
		intlLocale: 'de-DE',
		confirmDialog: { title: 'Bestätigen', cancelButtonText: 'Abbrechen' },
	},
});
```

`intlLocale` is a BCP-47 tag. Calendar and the date pickers format month and weekday names with it.

Pass a ref or getter to follow a language switcher without a reload:

```ts
app.use(shonkUI, { locale: computed(() => (lang.value === 'ru' ? ru : en)) });
```

## One component

The `locale` prop takes the keys of the component's locale section and merges them over the app locale. On a root it reaches every part inside:

```vue-html
<Pagination
	:total="100"
	:locale="{ nextButtonText: 'Дальше', previousButtonText: 'Раньше' }"
>
	<PaginationContent>
		<PaginationPrevious />
		<PaginationNext />
	</PaginationContent>
</Pagination>
```

Calendar takes its Intl locale the same way:

```vue-html
<Calendar :locale="{ intlLocale: 'de-DE' }" />
```

## Confirm dialogs

`require()` overrides a single confirm dialog:

```ts
useConfirm().require({
	title: 'Удаление',
	message: 'Удалить продукт?',
	acceptButtonText: 'Удалить',
	cancelButtonText: 'Отмена',
	accept: () => deleteProduct(),
});
```
