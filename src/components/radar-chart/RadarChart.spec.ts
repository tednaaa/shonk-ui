import { flushPromises, mount } from '@vue/test-utils';
import { RadarChart } from '.';

const items = [
	{ key: 'linux', label: 'Linux', value: 88 },
	{ key: 'git', label: 'Git', value: 92 },
	{ key: 'docker', label: 'Docker', value: null },
];

function mountChart(active?: string) {
	const wrapper = mount(RadarChart, { attachTo: document.body, props: { items, active } });
	wrapper.setProps({ 'onUpdate:active': (key?: string) => wrapper.setProps({ active: key }) });

	return wrapper;
}

describe('radarChart', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('makes the first axis tabbable while none is active', () => {
		const wrapper = mountChart();
		const tabbable = wrapper.findAll('[role="radio"]').filter(radio => radio.attributes('tabindex') === '0');

		expect(tabbable.map(radio => radio.text())).toEqual(['Linux']);
		wrapper.unmount();
	});

	it('wraps arrow navigation around the circle and moves focus', async () => {
		const wrapper = mountChart('linux');

		await wrapper.get('[role="radiogroup"]').trigger('keydown', { key: 'ArrowLeft' });
		await flushPromises();

		expect(wrapper.emitted('update:active')).toEqual([['docker']]);
		expect(document.activeElement?.textContent?.trim()).toBe('Docker');
		wrapper.unmount();
	});
});
