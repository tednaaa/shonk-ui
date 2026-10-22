export type Appearance = 'light' | 'dark';

const appearanceKey = 'vitepress-theme-appearance';

function savedAppearance(): string | null {
	try {
		return localStorage.getItem(appearanceKey);
	}
	catch {
		return null;
	}
}

export function storedAppearance(): Appearance {
	const saved = savedAppearance();

	if (saved === 'light' || saved === 'dark')
		return saved;

	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function storeAppearance(appearance: Appearance) {
	if (appearance === storedAppearance())
		return;

	try {
		localStorage.setItem(appearanceKey, appearance);
	}
	catch {}
}
