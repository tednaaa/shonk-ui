export type FileRejectReason = 'type' | 'size' | 'count';

export interface FileRejection {
	file: File;
	reason: FileRejectReason;
}

export interface FileRules {
	accept?: string;
	maxSize?: number;
	maxFiles?: number;
	multiple?: boolean;
}

function matchesAccept(file: File, accept: string) {
	const tokens = accept.split(',').map(token => token.trim().toLowerCase()).filter(Boolean);
	if (tokens.length === 0)
		return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return tokens.some((token) => {
		if (token.startsWith('.'))
			return name.endsWith(token);
		if (token.endsWith('/*'))
			return type.startsWith(token.slice(0, -1));
		return type === token;
	});
}

export function mergeFiles(current: File[], incoming: File[], rules: FileRules) {
	const rejected: FileRejection[] = [];
	const valid: File[] = [];
	for (const file of incoming) {
		if (rules.accept && !matchesAccept(file, rules.accept))
			rejected.push({ file, reason: 'type' });
		else if (rules.maxSize !== undefined && file.size > rules.maxSize)
			rejected.push({ file, reason: 'size' });
		else
			valid.push(file);
	}

	const base = rules.multiple ? current : [];
	const limit = rules.multiple ? (rules.maxFiles ?? Infinity) : 1;
	const room = Math.max(limit - base.length, 0);
	const accepted = valid.slice(0, room);
	for (const file of valid.slice(room))
		rejected.push({ file, reason: 'count' });

	return { files: accepted.length > 0 ? [...base, ...accepted] : current, rejected };
}
