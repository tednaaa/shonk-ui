import type { Palette } from '../src/lib/storybook/palette';
import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { version } from '../package.json';
import { loadPalette, PALETTE_EVENT, paletteTheme, savePalette } from '../src/lib/storybook/palette';
import {
	THEME_TOGGLE_ADDON_ID,
	THEME_TOGGLE_TOOL_ID,
	ThemeToggle,
} from '../src/lib/storybook/themeToggle';

const brandTitle = `<span style="display: inline-flex; align-items: center; gap: 8px"><img src="./logo.svg" width="24" height="24" alt="" />Shonk UI v${version}</span>`;

const savedPalette = loadPalette();

addons.setConfig({
	theme: savedPalette ? paletteTheme(savedPalette, { brandTitle }) : create({ base: 'light', brandTitle }),
});

addons.register(THEME_TOGGLE_ADDON_ID, (api) => {
	api.on(PALETTE_EVENT, (palette: Palette) => {
		savePalette(palette);
		api.setOptions({ theme: paletteTheme(palette, { brandTitle }) });
	});

	addons.add(THEME_TOGGLE_TOOL_ID, {
		type: types.TOOL,
		title: 'Theme',
		match: ({ tabId }) => !tabId,
		render: ThemeToggle,
	});
});
