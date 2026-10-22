import type { ThemeVars, ThemeVarsPartial } from 'storybook/theming';
import { create } from 'storybook/theming';

export const PALETTE_EVENT = 'shonk-ui/palette';

const storageKey = 'shonk-ui/storybook-palette';

const tokens = [
	'background',
	'foreground',
	'card',
	'primary',
	'secondary',
	'muted-foreground',
	'accent',
	'border',
	'destructive',
	'input',
	'sidebar',
] as const;

type Token = typeof tokens[number];

export interface Palette {
	base: 'light' | 'dark';
	preset?: string;
	colors: Record<Token, string>;
}

let canvasContext: CanvasRenderingContext2D | null = null;

function toRgba(color: string) {
	canvasContext ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 })
		.getContext('2d', { willReadFrequently: true });

	if (!canvasContext)
		return color;

	canvasContext.clearRect(0, 0, 1, 1);
	canvasContext.fillStyle = color;
	canvasContext.fillRect(0, 0, 1, 1);

	const [red, green, blue, alpha] = canvasContext.getImageData(0, 0, 1, 1).data;

	return `rgba(${red}, ${green}, ${blue}, ${(alpha / 255).toFixed(3)})`;
}

export function readPalette(element: HTMLElement): Palette {
	const style = getComputedStyle(element);
	const colors = Object.fromEntries(
		tokens.map(token => [token, toRgba(style.getPropertyValue(`--${token}`).trim())]),
	) as Palette['colors'];

	return {
		base: element.classList.contains('dark') ? 'dark' : 'light',
		preset: element.dataset.theme,
		colors,
	};
}

export function savePalette(palette: Palette) {
	try {
		localStorage.setItem(storageKey, JSON.stringify(palette));
	}
	catch {}
}

export function loadPalette(): Palette | undefined {
	try {
		const saved = localStorage.getItem(storageKey);

		return saved ? JSON.parse(saved) : undefined;
	}
	catch {
		return undefined;
	}
}

export function paletteTheme({ base, colors }: Palette, overrides: Partial<ThemeVarsPartial> = {}): ThemeVars {
	return create({
		base,
		colorPrimary: colors.primary,
		colorSecondary: colors.primary,
		appBg: colors.sidebar,
		appContentBg: colors.background,
		appPreviewBg: colors.background,
		appHoverBg: colors.accent,
		appBorderColor: colors.border,
		textColor: colors.foreground,
		textMutedColor: colors['muted-foreground'],
		textInverseColor: colors.background,
		barBg: colors.background,
		barTextColor: colors['muted-foreground'],
		barHoverColor: colors.primary,
		barSelectedColor: colors.primary,
		buttonBg: colors.secondary,
		buttonBorder: colors.border,
		booleanBg: colors.secondary,
		booleanSelectedBg: colors.card,
		inputBg: colors.background,
		inputBorder: colors.input,
		inputTextColor: colors.foreground,
		...overrides,
	});
}
