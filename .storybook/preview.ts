import type { Preview } from '@storybook/vue3-vite';
import type { Globals } from 'storybook/internal/types';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import { computed, provide } from 'vue';
import { templateSource } from '@/lib/storybook';
import { ThemedDocsContainer } from '@/lib/storybook/docsContainer';
import { PALETTE_EVENT, readPalette } from '@/lib/storybook/palette';
import { en, localeInjectionKey, resolveLocale, ru } from '@/locales';
import { registerVueGrammar } from './highlighting';
import './preview.css';

registerVueGrammar();

const locales = { en, ru };

const presetItems = [
	{ value: 'atlas', title: 'Atlas' },
	{ value: 'acorn', title: 'Acorn' },
	{ value: 'nocturne', title: 'Nocturne' },
	{ value: 'orchid', title: 'Orchid' },
];

const defaultPreset = presetItems[0].value;

const channel = addons.getChannel();

function applyAppearance({ globals }: { globals: Globals }) {
	const root = document.documentElement;
	const preset = globals.preset ?? defaultPreset;

	root.classList.toggle('dark', globals.theme === 'dark');
	delete root.dataset.theme;

	if (preset !== defaultPreset)
		root.dataset.theme = preset;

	root.style.removeProperty('background');
	channel.emit(PALETTE_EVENT, readPalette(root));
}

channel.on(SET_GLOBALS, applyAppearance);
channel.on(GLOBALS_UPDATED, applyAppearance);

const preview: Preview = {
	initialGlobals: {
		theme: 'light',
		locale: 'en',
		preset: defaultPreset,
	},
	globalTypes: {
		preset: {
			description: 'Theme preset, over both light and dark',
			toolbar: {
				icon: 'paintbrush',
				items: presetItems,
				dynamicTitle: true,
			},
		},
		locale: {
			description: 'Locale for text baked into components',
			toolbar: {
				icon: 'globe',
				items: [
					{ value: 'en', title: 'English' },
					{ value: 'ru', title: 'Русский' },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(_story, context) => ({
			setup() {
				provide(localeInjectionKey, computed(() => {
					const locale = context.globals.locale as keyof typeof locales;

					return resolveLocale(locales[locale] ?? en);
				}));
			},
			template: '<story />',
		}),
	],
	parameters: {
		options: {
			storySort: {
				order: ['Changelog', 'Foundations', 'Actions', 'Forms', 'Dates', 'Overlays', 'Navigation', 'Data', 'Feedback', 'Layout', 'Chat', 'Mobile'],
			},
		},
		docs: {
			container: ThemedDocsContainer,
			source: {
				language: 'vue',
				transform: templateSource,
			},
		},
		backgrounds: { disable: true },
		controls: {
			disable: true,
			disableSaveFromUI: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
