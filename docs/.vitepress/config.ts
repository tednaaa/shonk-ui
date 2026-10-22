import { defineConfig } from 'vitepress';

export default defineConfig({
	srcDir: 'src',

	title: 'Shonk UI',
	head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
	description: 'Vue 3 components on Reka UI and Tailwind CSS v4',
	themeConfig: {
		logo: '/logo.svg',

		nav: [
			{ text: 'Guide', link: '/guide/getting-started' },
			{ text: 'Storybook', link: '/storybook/', target: '_self' },
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
