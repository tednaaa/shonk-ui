import { MoonIcon, SunIcon } from '@storybook/icons';
import React from 'react';
import { ToggleButton } from 'storybook/internal/components';
import { useGlobals } from 'storybook/manager-api';

export const THEME_TOGGLE_ADDON_ID = 'theme-toggle';
export const THEME_TOGGLE_TOOL_ID = `${THEME_TOGGLE_ADDON_ID}/tool`;

export function ThemeToggle() {
  const [globals, updateGlobals] = useGlobals();
  const isDark = globals.theme === 'dark';

  return (
    <ToggleButton
      key={THEME_TOGGLE_TOOL_ID}
      padding="small"
      variant="ghost"
      pressed={isDark}
      ariaLabel="Toggle theme"
      tooltip={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => updateGlobals({ theme: isDark ? 'light' : 'dark' })}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span style={{ marginLeft: 6 }}>{isDark ? 'Dark' : 'Light'}</span>
    </ToggleButton>
  );
}
