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
    brandTitle: `Shonk UI v${version}`,
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
