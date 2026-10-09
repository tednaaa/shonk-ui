import type { Component } from 'vue';
import type { ChartConfig, ChartTooltipContentProps } from './types';
import { h, render } from 'vue';

export type ChartTooltipOptions = Omit<ChartTooltipContentProps, 'payload' | 'config' | 'x'>;

export function componentToString<T extends Component<ChartTooltipContentProps>>(
	config: ChartConfig,
	component: T,
	options: ChartTooltipOptions = {},
) {
	const rendered = new Map<string, string>();

	return (datum: object, x: number | Date) => {
		const key = JSON.stringify([datum, x]);
		const cached = rendered.get(key);

		if (cached !== undefined)
			return cached;

		const element = document.createElement('div');
		render(h(component, { ...options, payload: datum, config, x }), element);
		const html = element.innerHTML;
		render(null, element);

		rendered.set(key, html);

		return html;
	};
}
