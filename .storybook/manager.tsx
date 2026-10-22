import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { version } from '../package.json';
import {
	THEME_TOGGLE_ADDON_ID,
	THEME_TOGGLE_TOOL_ID,
	ThemeToggle,
} from '../src/lib/storybook/themeToggle';

addons.setConfig({
	theme: create({
		base: 'light',
		brandTitle: `<span style="display: inline-flex; align-items: center; gap: 8px"><img src="./logo.svg" width="24" height="24" alt="" />Shonk UI v${version}</span>`,
	}),
});

addons.register(THEME_TOGGLE_ADDON_ID, () => {
	addons.add(THEME_TOGGLE_TOOL_ID, {
		type: types.TOOL,
		title: 'Theme',
		match: ({ tabId }) => !tabId,
		render: ThemeToggle,
	});
});
