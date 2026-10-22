import type { VueWrapper } from '@vue/test-utils';
import { DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { MultiCombobox } from '.';

const frameworks = [
	{ label: 'Next.js', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'SvelteKit', value: 'svelte' },
	{ label: 'Astro', value: 'astro' },
];

enableAutoUnmount(afterEach);

function mountMultiCombobox(initial: string[] = [], combobox = '<MultiCombobox v-model="selected" :options="frameworks" />') {
	const selected = ref(initial);

	const Host = defineComponent({
		components: { MultiCombobox },
		setup() {
			return { selected, frameworks };
		},
		template: combobox,
	});

	const wrapper = mount(Host, { attachTo: document.body });

	return { wrapper, selected };
}

type Wrapper = Pick<VueWrapper, 'get'>;

const body = new DOMWrapper(document.body);

function trigger(wrapper: Wrapper) {
	return wrapper.get('[role="combobox"]');
}

async function openList(wrapper: Wrapper) {
	await trigger(wrapper).trigger('click');
	await flushPromises();
}

function option(label: string) {
	return body.getElementByText('[data-slot="command-item"]', label);
}

function optionLabels() {
	return body.findAll('[data-slot="command-item"]').map(item => item.text());
}

function selectAll() {
	return body.get('[data-slot="popover-content"] [role="checkbox"]');
}

function popoverText() {
	return body.get('[data-slot="popover-content"]').text();
}

describe('multiCombobox', () => {
	it('should add and remove an option from the model on click', async () => {
		const { wrapper, selected } = mountMultiCombobox();

		await openList(wrapper);
		await option('SvelteKit').trigger('click');
		await option('Next.js').trigger('click');

		expect(selected.value).toEqual(['svelte', 'next']);
		expect(option('SvelteKit').attributes('aria-selected')).toBe('true');

		await option('SvelteKit').trigger('click');

		expect(selected.value).toEqual(['next']);
	});

	it('should name the trigger after the selection', async () => {
		const { wrapper, selected } = mountMultiCombobox();

		expect(trigger(wrapper).text()).toBe('Select…');

		selected.value = ['svelte'];
		await flushPromises();

		expect(trigger(wrapper).text()).toBe('SvelteKit');

		selected.value = ['svelte', 'astro'];
		await flushPromises();

		expect(trigger(wrapper).text()).toBe('2 selected');

		selected.value = frameworks.map(framework => framework.value);
		await flushPromises();

		expect(trigger(wrapper).text()).toBe('All');
	});

	it('should select every option with select all and mark it partly checked when some are selected', async () => {
		const { wrapper, selected } = mountMultiCombobox(['svelte']);

		await openList(wrapper);

		expect(selectAll().attributes('aria-checked')).toBe('mixed');

		await selectAll().trigger('click');

		expect(selected.value).toEqual(['svelte', 'next', 'nuxt', 'astro']);
		expect(selectAll().attributes('aria-checked')).toBe('true');
		expect(popoverText()).toContain('All selected · 4');

		await selectAll().trigger('click');

		expect(selected.value).toEqual([]);
	});

	it('should select only the options matching the search and keep the others', async () => {
		const { wrapper, selected } = mountMultiCombobox(['astro']);

		await openList(wrapper);
		await body.get('[data-slot="command-input"]').setValue('n');

		expect(optionLabels()).toEqual(['Next.js', 'Nuxt']);
		expect(selectAll().attributes('aria-checked')).toBe('false');

		await selectAll().trigger('click');

		expect(selected.value).toEqual(['astro', 'next', 'nuxt']);

		await selectAll().trigger('click');

		expect(selected.value).toEqual(['astro']);
	});

	it('should clear the selection with reset', async () => {
		const { wrapper, selected } = mountMultiCombobox(['svelte', 'astro']);

		await openList(wrapper);

		expect(popoverText()).toContain('2 of 4 selected');

		await body.getElementByText('[data-slot="popover-content"] button', 'Reset').trigger('click');

		expect(selected.value).toEqual([]);
		expect(trigger(wrapper).text()).toBe('Select…');
	});

	it('should show the custom placeholder when nothing is selected and the custom all text when everything is', async () => {
		const { wrapper, selected } = mountMultiCombobox([], '<MultiCombobox v-model="selected" :options="frameworks" trigger-placeholder="Pick frameworks" all-selected-text="Every framework" />');

		expect(trigger(wrapper).text()).toBe('Pick frameworks');

		selected.value = frameworks.map(framework => framework.value);
		await flushPromises();

		expect(trigger(wrapper).text()).toBe('Every framework');
	});

	it('should select every option after a search is left behind by closing the list', async () => {
		const { wrapper, selected } = mountMultiCombobox();

		await openList(wrapper);
		await body.get('[data-slot="command-input"]').setValue('Svelte');
		await openList(wrapper);
		await openList(wrapper);
		await selectAll().trigger('click');

		expect(selected.value).toHaveLength(frameworks.length);
	});

	it('should open from a trigger passed in the slot', async () => {
		const { wrapper } = mountMultiCombobox([], `
			<MultiCombobox v-model="selected" :options="frameworks">
				<template #trigger><button type="button">Frameworks</button></template>
			</MultiCombobox>
		`);

		await wrapper.getElementByText('button', 'Frameworks').trigger('click');
		await flushPromises();

		expect(optionLabels()).toHaveLength(frameworks.length);
	});

	it('should pass the whole option to the option slot and the selected ones to the value slot', async () => {
		const tokens = [
			{ label: 'Bitcoin', value: 'BTC', ticker: '₿' },
			{ label: 'Ethereum', value: 'ETH', ticker: 'Ξ' },
			{ label: 'Solana', value: 'SOL', ticker: '◎' },
		];
		const selected = ref<string[]>([]);
		const wrapper = mount(defineComponent({
			components: { MultiCombobox },
			setup: () => ({ selected, tokens }),
			template: `
				<MultiCombobox v-model="selected" :options="tokens">
					<template #option="{ option }">{{ option.ticker }} {{ option.label }}</template>
					<template #value="{ selected: chosen, text }">{{ chosen.map(option => option.ticker).join(' ') }} {{ text }}</template>
				</MultiCombobox>
			`,
		}), { attachTo: document.body });

		await openList(wrapper);
		await option('◎ Solana').trigger('click');
		await option('₿ Bitcoin').trigger('click');

		expect(trigger(wrapper).text()).toBe('◎ ₿ 2 selected');
	});

	it('should list the options selected before opening first and keep the order while the list is open', async () => {
		const { wrapper } = mountMultiCombobox(['astro'], '<MultiCombobox v-model="selected" :options="frameworks" pin-selected-option />');

		await openList(wrapper);

		expect(optionLabels()).toEqual(['Astro', 'Next.js', 'Nuxt', 'SvelteKit']);

		await option('SvelteKit').trigger('click');

		expect(optionLabels()).toEqual(['Astro', 'Next.js', 'Nuxt', 'SvelteKit']);

		await openList(wrapper);
		await openList(wrapper);

		expect(optionLabels()).toEqual(['SvelteKit', 'Astro', 'Next.js', 'Nuxt']);
	});
});
