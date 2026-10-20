import type { VueWrapper } from '@vue/test-utils';
import type { FilterDefinition } from './types';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, markRaw } from 'vue';
import FilteredSearch from './FilteredSearch.vue';

const definitions: FilterDefinition[] = [
	{
		key: 'status',
		label: 'Status',
		operators: [
			{ value: 'equals', label: 'is' },
			{ value: 'notEquals', label: 'is not' },
		],
	},
];

enableAutoUnmount(afterEach);

function createComponent(props: Record<string, unknown> = {}) {
	return mount(FilteredSearch, {
		attachTo: document.body,
		props: { definitions, ...props },
	});
}

describe('filteredSearch keyboard navigation', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	beforeEach(async () => {
		wrapper = createComponent();
	});

	async function openAndSelectStatusKey() {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
	}

	describe('operator phase - arrow navigation', () => {
		it('arrowDown highlights the first operator', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await flushPromises();

			const highlighted = document.querySelector('[role="option"][aria-selected="true"]');
			expect(highlighted?.textContent?.trim()).toBe('is');
		});

		it('arrowDown twice highlights the second operator', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'ArrowDown' });
			await flushPromises();

			const highlighted = document.querySelector('[role="option"][aria-selected="true"]');
			expect(highlighted?.textContent?.trim()).toBe('is not');
		});

		it('arrowDown does not go past the last operator', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'ArrowDown' });
			await flushPromises();

			const highlighted = document.querySelector('[role="option"][aria-selected="true"]');
			expect(highlighted?.textContent?.trim()).toBe('is not');
		});

		it('arrowUp deselects when at first operator', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'ArrowUp' });
			await flushPromises();

			const highlighted = document.querySelector('[role="option"][aria-selected="true"]');
			expect(highlighted).toBeNull();
		});
	});

	describe('operator phase - Enter key', () => {
		it('enter with a highlighted operator moves to value phase', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'Enter' });

			expect(input.attributes('placeholder')).toBe('Enter value…');
		});

		it('enter without highlight does nothing', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'Enter' });

			expect(input.attributes('placeholder')).toBe('Select operator…');
		});
	});

	describe('backspace - go back', () => {
		it('backspace in operator phase goes back to key phase', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'Backspace' });

			expect(input.attributes('placeholder')).toBe('Search or filter…');
		});

		it('backspace in value phase goes back to operator phase', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'Enter' });
			await input.trigger('keydown', { key: 'Backspace' });

			expect(input.attributes('placeholder')).toBe('Select operator…');
		});
	});

	describe('escape - full cancel', () => {
		it('escape in operator phase resets to key phase', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'Escape' });

			expect(input.attributes('placeholder')).toBe('Search or filter…');
		});

		it('escape in value phase resets to key phase', async () => {
			await openAndSelectStatusKey();
			const input = wrapper.find('input');
			await input.trigger('keydown', { key: 'ArrowDown' });
			await input.trigger('keydown', { key: 'Enter' });
			await input.trigger('keydown', { key: 'Escape' });

			expect(input.attributes('placeholder')).toBe('Search or filter…');
		});

		it('escape in key phase closes the popover', async () => {
			const input = wrapper.find('input');
			await input.trigger('focus');
			await input.trigger('keydown', { key: 'Escape' });

			expect(input.attributes('placeholder')).toBe('Search or filter…');
		});
	});
});

describe('filteredSearch free text', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	async function typeAndConfirm(text: string) {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.setValue(text);
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		return input;
	}

	it('should turn free text into a search term on Enter', async () => {
		wrapper = createComponent();

		const input = await typeAndConfirm('btcusdt');

		expect(wrapper.emitted('update:searchText')).toEqual([['btcusdt']]);
		expect((input.element as HTMLInputElement).value).toBe('');
	});

	it('should leave free text alone on Enter when searchable is false', async () => {
		wrapper = createComponent({ searchable: false });

		const input = await typeAndConfirm('btcusdt');

		expect(wrapper.emitted('update:searchText')).toBeUndefined();
		expect((input.element as HTMLInputElement).value).toBe('btcusdt');
	});
});

describe('filteredSearch definitions', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	async function openKeyList() {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await flushPromises();
		return input;
	}

	it('should hide a unique definition once it has been applied', async () => {
		wrapper = createComponent({
			definitions: [{ ...definitions[0], unique: true }],
			filters: [{
				id: 'a',
				key: 'status',
				keyLabel: 'Status',
				operator: 'equals',
				operatorLabel: 'is',
				value: 'open',
				valueLabel: 'Open',
			}],
		});

		await openKeyList();

		expect(document.querySelectorAll('[role="option"]')).toHaveLength(0);
		expect(document.body.textContent).toContain('No filters found.');
	});

	it('should skip the operator phase when a definition has a single operator', async () => {
		wrapper = createComponent({
			definitions: [{ key: 'status', label: 'Status', operators: [{ value: 'equals', label: 'is' }] }],
		});

		const input = await openKeyList();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(input.attributes('placeholder')).toBe('Enter value…');
	});

	it('should render the icon a definition supplies', async () => {
		const PencilIcon = markRaw(defineComponent({ render: () => h('svg', { 'data-testid': 'pencil' }) }));
		wrapper = createComponent({ definitions: [{ ...definitions[0], icon: PencilIcon }] });

		await openKeyList();

		expect(document.querySelector('[data-testid="pencil"]')).not.toBeNull();
	});
});

describe('filteredSearch value editors', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	async function openValuePhase() {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		return input;
	}

	it('should suggest the options a definition carries and commit the chosen one', async () => {
		wrapper = createComponent({
			definitions: [{
				key: 'status',
				label: 'Status',
				operators: [{ value: 'equals', label: 'is' }],
				options: [
					{ value: 'open', label: 'Open' },
					{ value: 'closed', label: 'Closed' },
				],
			}],
		});

		const input = await openValuePhase();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'status', operator: 'equals', value: 'closed', valueLabel: 'Closed' },
		]);
	});

	it('should render each suggested option through the definition', async () => {
		wrapper = createComponent({
			definitions: [{
				key: 'status',
				label: 'Status',
				operators: [{ value: 'equals', label: 'is' }],
				options: [{ value: 'open', label: 'Open' }],
				renderOption: (option: { label: string }) => `Status: ${option.label}`,
			}],
		});

		await openValuePhase();

		expect(document.querySelector('[role="option"]')?.textContent?.trim()).toBe('Status: Open');
	});

	it('should commit what the editor a definition supplies submits', async () => {
		const YearEditor = markRaw(defineComponent({
			emits: ['submit'],
			setup(_, { emit }) {
				return () => h('button', {
					'data-testid': 'year',
					'onClick': () => emit('submit', { value: '2026', label: 'This year' }),
				});
			},
		}));

		wrapper = createComponent({
			definitions: [{
				key: 'createdAt',
				label: 'Created',
				operators: [{ value: 'equals', label: 'is' }],
				editor: YearEditor,
			}],
		});

		await openValuePhase();
		const editorButton = document.querySelector<HTMLButtonElement>('[data-testid="year"]');
		editorButton?.click();
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'createdAt', operator: 'equals', value: '2026', valueLabel: 'This year' },
		]);
	});
});

describe('filteredSearch view only', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	const applied = [{
		id: 'a',
		key: 'status',
		keyLabel: 'Status',
		operator: 'equals',
		operatorLabel: 'is',
		value: 'open',
		valueLabel: 'Open',
	}];

	it('should drop the input, the clear button and the token remove buttons', () => {
		wrapper = createComponent({ viewOnly: true, filters: applied });

		expect(wrapper.find('input').exists()).toBe(false);
		expect(wrapper.findAll('button')).toHaveLength(0);
		expect(wrapper.text()).toContain('Status');
		expect(wrapper.text()).toContain('Open');
	});

	it('should keep the tokens removable when it is not view only', () => {
		wrapper = createComponent({ filters: applied });

		expect(wrapper.find('input').exists()).toBe(true);
		expect(wrapper.find('[aria-label="Remove Status filter"]').exists()).toBe(true);
	});
});

describe('filteredSearch history', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	const historyItems = [{
		filters: [{
			id: 'a',
			key: 'status',
			keyLabel: 'Status',
			operator: 'equals',
			operatorLabel: 'is',
			value: 'open',
			valueLabel: 'Open',
		}],
		searchText: 'btcusdt',
	}];

	async function openHistory() {
		wrapper.get('[aria-label="Toggle search history"]').trigger('click');
		await flushPromises();
	}

	it('should apply the filters and the search text of the chosen entry', async () => {
		wrapper = createComponent({ historyItems });

		await openHistory();
		document.querySelector<HTMLButtonElement>('[aria-label^="Select recent search"]')?.click();
		await flushPromises();

		expect(wrapper.emitted('update:searchText')?.at(-1)).toEqual(['btcusdt']);
		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'status', operator: 'equals', value: 'open' },
		]);
	});

	it('should ask the app to clear the history instead of clearing it itself', async () => {
		wrapper = createComponent({ historyItems });

		await openHistory();
		const clearButton = [...document.querySelectorAll('button')]
			.find(button => button.textContent?.trim() === 'Clear recent searches');
		clearButton?.click();
		await flushPromises();

		expect(wrapper.emitted('clearHistory')).toHaveLength(1);
	});

	it('should say so when there is nothing to recall', async () => {
		wrapper = createComponent({ historyItems: [] });

		await openHistory();

		expect(document.body.textContent).toContain('You don\'t have any recent searches');
	});

	it('should not offer history when the app passes none', () => {
		wrapper = createComponent();

		expect(wrapper.find('[aria-label="Toggle search history"]').exists()).toBe(false);
	});
});

describe('filteredSearch multi select', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	const multiDefinitions: FilterDefinition[] = [{
		key: 'label',
		label: 'Label',
		multiSelect: true,
		operators: [{ value: 'oneOf', label: 'is one of' }],
		options: [
			{ value: 'bug', label: 'bug' },
			{ value: 'wip', label: 'WIP' },
			{ value: 'docs', label: 'docs' },
		],
	}];

	async function openValuePhase() {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		return input;
	}

	it('should render a token value through the definition with the chosen options', () => {
		wrapper = createComponent({
			definitions: [{ ...multiDefinitions[0], renderValue: ({ options }: { options: unknown[] }) => `${options.length} labels` }],
			filters: [{ id: '1', key: 'label', keyLabel: 'Label', operator: 'oneOf', operatorLabel: 'is one of', value: ['bug', 'docs'], valueLabel: 'bug, docs' }],
		});

		expect(wrapper.get('[aria-label="Edit Label filter"]').text()).toBe('2 labels');
	});

	it('should gather several options into one filter', async () => {
		wrapper = createComponent({ definitions: multiDefinitions });

		const input = await openValuePhase();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')).toBeUndefined();

		await input.trigger('keydown', { key: 'ArrowUp' });
		await input.trigger('keydown', { key: 'ArrowUp' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'label', operator: 'oneOf', value: ['bug', 'wip'], valueLabel: 'bug, WIP' },
		]);
	});

	it('should drop the last pick on Backspace instead of leaving the value phase', async () => {
		wrapper = createComponent({ definitions: multiDefinitions });

		const input = await openValuePhase();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await input.trigger('keydown', { key: 'Backspace' });
		await flushPromises();

		expect(input.attributes('placeholder')).toBe('Enter value…');
	});
});

describe('filteredSearch value validation', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	beforeEach(() => {
		wrapper = createComponent({
			definitions: [{
				key: 'price',
				label: 'Price',
				operators: [{ value: 'gt', label: '>' }],
				validate: (value: string) => /^-?\d+(?:\.\d+)?$/.test(value) ? undefined : 'Enter a number',
			}],
		});
	});

	async function typeValue(text: string) {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await input.setValue(text);
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		return input;
	}

	function describedBy(input: Element) {
		return document.getElementById(input.getAttribute('aria-describedby') ?? '')?.textContent?.trim();
	}

	it('should keep a rejected value and say why instead of adding a filter', async () => {
		const input = await typeValue('abc');

		expect(wrapper.emitted('update:filters')).toBeUndefined();
		expect((input.element as HTMLInputElement).value).toBe('abc');
		expect(input.attributes('aria-invalid')).toBe('true');
		expect(describedBy(input.element)).toBe('Enter a number');
	});

	it('should drop the error once the value changes', async () => {
		const input = await typeValue('abc');
		await input.setValue('ab');

		expect(input.attributes('aria-invalid')).toBeUndefined();
		expect(document.body.textContent).not.toContain('Enter a number');
	});

	it('should commit a value that passes', async () => {
		await typeValue('-1.5');

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'price', operator: 'gt', value: '-1.5' },
		]);
	});
});

describe('filteredSearch editing a filter', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	const editDefinitions: FilterDefinition[] = [
		{
			key: 'label',
			label: 'Label',
			multiSelect: true,
			operators: [{ value: 'oneOf', label: 'is one of' }],
			options: [
				{ value: 'bug', label: 'bug' },
				{ value: 'wip', label: 'WIP' },
				{ value: 'docs', label: 'docs' },
			],
		},
		{
			key: 'author',
			label: 'Author',
			unique: true,
			operators: [
				{ value: 'equals', label: 'is' },
				{ value: 'notEquals', label: 'is not' },
			],
		},
	];

	const applied = [
		{ id: 'a', key: 'label', keyLabel: 'Label', operator: 'oneOf', operatorLabel: 'is one of', value: ['bug'], valueLabel: 'bug' },
		{ id: 'b', key: 'author', keyLabel: 'Author', operator: 'equals', operatorLabel: 'is', value: 'ann', valueLabel: 'ann' },
	];

	async function editToken(name: string) {
		await wrapper.get(`[aria-label="Edit ${name} filter"]`).trigger('click');
		await flushPromises();
		return wrapper.find('input');
	}

	it('should reopen the picks of a multi select filter and replace it in place', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		const input = await editToken('Label');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await input.trigger('keydown', { key: 'ArrowUp' });
		await input.trigger('keydown', { key: 'ArrowUp' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ id: 'a', key: 'label', value: ['bug', 'wip'], valueLabel: 'bug, WIP' },
			{ id: 'b', key: 'author', value: 'ann' },
		]);
	});

	it('should list the picks of a multi select filter first and keep that order while picking', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: [{ ...applied[0], value: ['docs'], valueLabel: 'docs' }] });
		const optionLabels = () => [...document.querySelectorAll('[role="option"]')].map(option => option.textContent?.trim());

		await editToken('Label');

		expect(optionLabels()).toEqual(['docs', 'bug', 'WIP']);

		document.querySelector<HTMLElement>('[role="option"]:nth-child(2)')?.click();
		await flushPromises();

		expect(optionLabels()).toEqual(['docs', 'bug', 'WIP']);
	});

	it('should prefill a typed value and replace it in place', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		const input = await editToken('Author');

		expect((input.element as HTMLInputElement).value).toBe('ann');

		await input.setValue('bob');
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ id: 'a', key: 'label', value: ['bug'] },
			{ id: 'b', key: 'author', value: 'bob' },
		]);
	});

	it('should edit the filter where its token sits instead of after the last one', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		const input = await editToken('Label');
		const nextToken = wrapper.get('[aria-label="Edit Author filter"]').element;

		expect(input.element.compareDocumentPosition(nextToken) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('should change the operator and keep the value when the operator is clicked', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		await wrapper.get('[aria-label="Change Author operator"]').trigger('click');
		await flushPromises();
		const input = wrapper.find('input');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ id: 'a', key: 'label' },
			{ id: 'b', key: 'author', operator: 'notEquals', operatorLabel: 'is not', value: 'ann' },
		]);
	});

	it('should reopen the key list with the key typed in and keep the rest when the key is clicked', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		await wrapper.get('[aria-label="Change Author filter type"]').trigger('click');
		await flushPromises();
		const input = wrapper.find('input');

		expect((input.element as HTMLInputElement).value).toBe('Author');
		const rest = [...input.element.nextElementSibling?.children ?? []].map(part => part.textContent?.trim());
		expect(rest).toEqual(['is', 'ann']);

		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ id: 'a', key: 'label' },
			{ id: 'b', key: 'author', operator: 'equals', value: 'ann' },
		]);
	});

	it('should leave the filter untouched when the edit is cancelled', async () => {
		wrapper = createComponent({ definitions: editDefinitions, filters: applied });

		const input = await editToken('Author');
		await input.trigger('keydown', { key: 'Escape' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')).toBeUndefined();
		expect(wrapper.find('[aria-label="Edit Author filter"]').exists()).toBe(true);
	});
});

describe('filteredSearch jumping to an earlier step', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	async function openValueStep() {
		const input = wrapper.find('input');
		await input.trigger('focus');
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		return input;
	}

	it('should reopen the operator list when the pending operator is clicked', async () => {
		wrapper = createComponent();

		const input = await openValueStep();
		await wrapper.get('[aria-label="Change Status operator"]').trigger('click');
		await flushPromises();
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'ArrowDown' });
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();
		await input.setValue('open');
		await input.trigger('keydown', { key: 'Enter' });
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([
			{ key: 'status', operator: 'notEquals', value: 'open' },
		]);
	});

	it('should reopen the whole key list with nothing picked when the pending key is clicked', async () => {
		wrapper = createComponent();

		const input = await openValueStep();
		await wrapper.get('[aria-label="Change Status filter type"]').trigger('click');
		await flushPromises();

		expect((input.element as HTMLInputElement).value).toBe('');
		expect(wrapper.find('[aria-label="Change Status filter type"]').exists()).toBe(false);
		expect(document.querySelector('[role="option"][aria-selected="true"]')).toBeNull();
	});
});

describe('filteredSearch dragging tokens', () => {
	let wrapper: VueWrapper<InstanceType<typeof FilteredSearch>>;

	const applied = [
		{ id: 'a', key: 'status', keyLabel: 'Status', operator: 'equals', operatorLabel: 'is', value: 'open', valueLabel: 'Open' },
		{ id: 'b', key: 'author', keyLabel: 'Author', operator: 'equals', operatorLabel: 'is', value: 'ann', valueLabel: 'ann' },
	];

	beforeEach(() => {
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
			const token = this.closest('[data-filter-id]');
			const left = [...document.querySelectorAll('[data-filter-id]')].indexOf(token as Element) * 100;
			return DOMRect.fromRect({ x: left, y: 0, width: 90, height: 24 });
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function drag(from: string, clientX: number, clientY = 10) {
		const element = wrapper.get(from).element as HTMLElement;
		element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }));
		window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }));
		window.dispatchEvent(new PointerEvent('pointerup', { clientX, clientY }));
		return element;
	}

	async function dragStatusTo(clientX: number) {
		drag('[data-filter-id="a"] [data-slot="filter-token-handle"]', clientX).click();
		await flushPromises();
	}

	it('should move a token past the one it is dropped beyond', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		await dragStatusTo(180);

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([{ id: 'b' }, { id: 'a' }]);
	});

	it('should not open the dropdown when a dragged token is released', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		await dragStatusTo(180);

		expect(document.querySelector('[role="listbox"]')).toBeNull();
	});

	it('should swap a token once it covers 30% of its neighbour', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		await dragStatusTo(50);

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([{ id: 'b' }, { id: 'a' }]);
	});

	it('should keep a swapped token in place while it is dragged a little further', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		const handle = wrapper.get('[data-filter-id="a"] [data-slot="filter-token-handle"]').element;
		handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }));
		window.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 10 }));
		await flushPromises();
		window.dispatchEvent(new PointerEvent('pointermove', { clientX: 60, clientY: 10 }));
		await flushPromises();

		expect(wrapper.emitted('update:filters')?.at(-1)?.[0]).toMatchObject([{ id: 'b' }, { id: 'a' }]);
		window.dispatchEvent(new PointerEvent('pointerup', { clientX: 60, clientY: 10 }));
	});

	it('should place a token by the pointer x alone when the tokens do not wrap', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		drag('[data-filter-id="a"] [data-slot="filter-token-handle"]', 30, 200);
		await flushPromises();

		expect(wrapper.emitted('update:filters')).toBeUndefined();
	});

	it('should drag a token only by its handle', async () => {
		wrapper = createComponent({ draggable: true, filters: applied });

		drag('[aria-label="Change Status filter type"]', 180);
		await flushPromises();

		expect(wrapper.emitted('update:filters')).toBeUndefined();
	});
});
