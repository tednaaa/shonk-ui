export function pinFirst<V, O extends { value: V }>(options: O[], values: V[]): O[] {
	if (values.length === 0)
		return options;
	const pinned = options.filter(option => values.includes(option.value));
	return [...pinned, ...options.filter(option => !values.includes(option.value))];
}
