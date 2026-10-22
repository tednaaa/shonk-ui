import { defineConfig } from 'vitepress';

export default defineConfig({
	srcDir: 'src',

	title: 'Shonk UI',
	description: 'Vue 3 components on Reka UI and Tailwind CSS v4',
	themeConfig: {
		nav: [
			{ text: 'Guide', link: '/guide/getting-started' },
		],

		sidebar: [
			{
				text: 'Guide',
				items: [
					{ text: 'Getting started', link: '/guide/getting-started' },
					{ text: 'Themes', link: '/guide/themes' },
					{ text: 'Theme validation', link: '/guide/theme-validation' },
					{ text: 'Localization', link: '/guide/localization' },
				],
			},
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/tednaaa/shonk-ui' },
		],
	},
});
