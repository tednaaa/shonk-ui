import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { PropsWithChildren } from 'react';
import type { Palette } from './palette';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import React, { useEffect, useState } from 'react';
import { themes } from 'storybook/theming';
import { loadPalette, PALETTE_EVENT, paletteTheme } from './palette';

export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
	const [palette, setPalette] = useState<Palette | undefined>(() => context.channel.last(PALETTE_EVENT)?.[0] ?? loadPalette());

	useEffect(() => {
		context.channel.on(PALETTE_EVENT, setPalette);

		return () => context.channel.off(PALETTE_EVENT, setPalette);
	}, [context.channel]);

	return (
		<DocsContainer context={context} theme={palette ? paletteTheme(palette) : themes.light}>
			{children}
		</DocsContainer>
	);
}
