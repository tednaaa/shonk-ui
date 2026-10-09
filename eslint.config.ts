import type { Linter } from 'eslint';
import { defineConfig } from '@tednaaa/eslint-config';
import storybook from 'eslint-plugin-storybook';
import tailwindcss from 'eslint-plugin-tailwindcss';

const tailwindRecommended = tailwindcss.configs.recommended as Linter.Config;

export default defineConfig(
	{
		vue: {
			overrides: {
				'vue/enforce-style-attribute': ['error', { allow: ['module'] }],
			},
		},
	},
	...storybook.configs['flat/recommended'],
	{
		...tailwindRecommended,
		settings: {
			tailwindcss: {
				cssConfigPath: '.storybook/preview.css',
				functions: ['cn', 'cva'],
			},
		},
		rules: {
			...tailwindRecommended.rules,
			'tailwindcss/no-custom-classname': ['warn', { whitelist: ['toaster'] }],
		},
	},
);
