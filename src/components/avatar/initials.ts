const TONES = [1, 2, 3, 4, 5] as const;

export type AvatarTone = typeof TONES[number];

export function nameInitials(name: string) {
	const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
	const [first = name, second] = words;
	const letters = second ? `${[...first][0]}${[...second][0]}` : [...first].slice(0, 2).join('');

	return letters.toUpperCase();
}

export function nameTone(name: string): AvatarTone {
	const hash = [...name].reduce((sum, char) => (sum * 31 + char.codePointAt(0)!) % 1_000_003, 7);

	return TONES[hash % TONES.length]!;
}
