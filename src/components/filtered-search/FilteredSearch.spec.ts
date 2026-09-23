import type { VueWrapper } from '@vue/test-utils';
import type { FilterDefinition } from './types';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
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
    const PencilIcon = defineComponent({ render: () => h('svg', { 'data-testid': 'pencil' }) });
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

  it('should commit what the editor a definition supplies submits', async () => {
    const YearEditor = defineComponent({
      emits: ['submit'],
      setup(_, { emit }) {
        return () => h('button', {
          'data-testid': 'year',
          'onClick': () => emit('submit', { value: '2026', label: 'This year' }),
        });
      },
    });

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
