import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { FilterDefinition } from './types';
import { example, render, showControls } from '@/lib/storybook';
import { FilteredSearch } from '.';
import FilteredSearchControlledSearchText from './_examples/FilteredSearchControlledSearchText.vue';
import filteredSearchControlledSearchTextSource from './_examples/FilteredSearchControlledSearchText.vue?raw';
import FilteredSearchCustomButtonGroup from './_examples/FilteredSearchCustomButtonGroup.vue';
import filteredSearchCustomButtonGroupSource from './_examples/FilteredSearchCustomButtonGroup.vue?raw';
import FilteredSearchCustomEditor from './_examples/FilteredSearchCustomEditor.vue';
import filteredSearchCustomEditorSource from './_examples/FilteredSearchCustomEditor.vue?raw';
import FilteredSearchCustomRender from './_examples/FilteredSearchCustomRender.vue';
import filteredSearchCustomRenderSource from './_examples/FilteredSearchCustomRender.vue?raw';
import FilteredSearchDraggable from './_examples/FilteredSearchDraggable.vue';
import filteredSearchDraggableSource from './_examples/FilteredSearchDraggable.vue?raw';
import FilteredSearchHistory from './_examples/FilteredSearchHistory.vue';
import filteredSearchHistorySource from './_examples/FilteredSearchHistory.vue?raw';
import FilteredSearchIcons from './_examples/FilteredSearchIcons.vue';
import filteredSearchIconsSource from './_examples/FilteredSearchIcons.vue?raw';
import FilteredSearchMultiSelect from './_examples/FilteredSearchMultiSelect.vue';
import filteredSearchMultiSelectSource from './_examples/FilteredSearchMultiSelect.vue?raw';
import FilteredSearchOptions from './_examples/FilteredSearchOptions.vue';
import filteredSearchOptionsSource from './_examples/FilteredSearchOptions.vue?raw';
import FilteredSearchSuffix from './_examples/FilteredSearchSuffix.vue';
import filteredSearchSuffixSource from './_examples/FilteredSearchSuffix.vue?raw';
import FilteredSearchUnique from './_examples/FilteredSearchUnique.vue';
import filteredSearchUniqueSource from './_examples/FilteredSearchUnique.vue?raw';
import FilteredSearchValidation from './_examples/FilteredSearchValidation.vue';
import filteredSearchValidationSource from './_examples/FilteredSearchValidation.vue?raw';
import FilteredSearchViewOnly from './_examples/FilteredSearchViewOnly.vue';
import filteredSearchViewOnlySource from './_examples/FilteredSearchViewOnly.vue?raw';
import FilteredSearchWrapped from './_examples/FilteredSearchWrapped.vue';
import filteredSearchWrappedSource from './_examples/FilteredSearchWrapped.vue?raw';

const definitions: FilterDefinition[] = [
	{
		key: 'title',
		label: 'Title',
		operators: [
			{ value: 'contains', label: 'contains' },
			{ value: 'equals', label: 'exactly equals' },
		],
	},
	{
		key: 'assignee',
		label: 'Assignee',
		operators: [
			{ value: 'equals', label: 'is' },
			{ value: 'notEquals', label: 'is not' },
		],
	},
];

const meta: Meta<typeof FilteredSearch> = {
	title: 'Data/FilteredSearch',
	component: FilteredSearch,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: [
					'A filter bar the application fills with its own vocabulary. The kit owns the chrome: the token list, the suggestions, focus and the keyboard.',
					'',
					'- `operators` are yours: `{ value: \'equals\', label: \'is\' }` and `{ value: \'=\', label: \'is\' }` are equally valid, no name is interpreted',
					'- `icon` and `editor` come from the app; an `editor` component replaces the value step outright, keyboard included, and gets `definition`, `operator`, `search` and the `value` of the filter being edited; it may submit a `keyLabel` to name the token\'s key, such as `MFI 4h` for a timeframe picked inside it',
					'- `options` are suggested, `multiSelect` gathers several into one token',
					'- `renderOption` and `renderValue` draw a suggested option and a token value with `h()`; `defineFilter` types them by the definition\'s options',
					'- `unique` drops a definition from the list once it has been applied',
					'- `viewOnly` renders the bar without any way to change it',
					'- `historyItems` are app-owned: the kit shows recent searches and emits `clearHistory`, but never writes the list',
				].join('\n'),
			},
		},
	},
	render: args => ({
		components: { FilteredSearch },
		setup: () => ({ args, definitions }),
		template: `
      <div class="max-w-xl">
        <FilteredSearch v-bind="args" :definitions="definitions" />
      </div>
    `,
	}),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const NotSearchable: Story = {
	args: { searchable: false, locale: { placeholder: 'Filter…' } },
};

export const WithIcons: Story = {
	parameters: example(filteredSearchIconsSource),
	render: render({ FilteredSearchIcons }, `
    <div class="max-w-xl">
      <FilteredSearchIcons />
    </div>
  `),
};

export const WithOptions: Story = {
	parameters: example(filteredSearchOptionsSource),
	render: render({ FilteredSearchOptions }, `
    <div class="max-w-xl">
      <FilteredSearchOptions />
    </div>
  `),
};

export const WithMultiSelect: Story = {
	parameters: example(filteredSearchMultiSelectSource),
	render: render({ FilteredSearchMultiSelect }, `
    <div class="max-w-xl">
      <FilteredSearchMultiSelect />
    </div>
  `),
};

export const WithCustomRender: Story = {
	parameters: example(filteredSearchCustomRenderSource),
	render: render({ FilteredSearchCustomRender }, `
    <div class="max-w-xl">
      <FilteredSearchCustomRender />
    </div>
  `),
};

export const WithHistoryItems: Story = {
	parameters: example(filteredSearchHistorySource),
	render: render({ FilteredSearchHistory }, `
    <div class="max-w-xl">
      <FilteredSearchHistory />
    </div>
  `),
};

export const ViewOnly: Story = {
	parameters: example(filteredSearchViewOnlySource),
	render: render({ FilteredSearchViewOnly }, `
    <div class="max-w-xl">
      <FilteredSearchViewOnly />
    </div>
  `),
};

export const Unique: Story = {
	parameters: example(filteredSearchUniqueSource),
	render: render({ FilteredSearchUnique }, `
    <div class="max-w-xl">
      <FilteredSearchUnique />
    </div>
  `),
};

export const Validation: Story = {
	parameters: example(filteredSearchValidationSource),
	render: render({ FilteredSearchValidation }, `
    <div class="max-w-xl">
      <FilteredSearchValidation />
    </div>
  `),
};

export const CustomEditor: Story = {
	parameters: example(filteredSearchCustomEditorSource),
	render: render({ FilteredSearchCustomEditor }, `
    <div class="max-w-xl">
      <FilteredSearchCustomEditor />
    </div>
  `),
};

export const Wrapped: Story = {
	parameters: example(filteredSearchWrappedSource),
	render: render({ FilteredSearchWrapped }, `
    <div class="max-w-md">
      <FilteredSearchWrapped />
    </div>
  `),
};

export const Draggable: Story = {
	parameters: example(filteredSearchDraggableSource),
	render: render({ FilteredSearchDraggable }, `
    <div class="max-w-xl">
      <FilteredSearchDraggable />
    </div>
  `),
};

export const WithSuffix: Story = {
	parameters: example(filteredSearchSuffixSource),
	render: render({ FilteredSearchSuffix }, `
    <div class="max-w-xl">
      <FilteredSearchSuffix />
    </div>
  `),
};

export const ControlledSearchText: Story = {
	parameters: example(filteredSearchControlledSearchTextSource),
	render: render({ FilteredSearchControlledSearchText }, `
    <div class="max-w-xl">
      <FilteredSearchControlledSearchText />
    </div>
  `),
};

export const InCustomButtonGroup: Story = {
	parameters: example(filteredSearchCustomButtonGroupSource),
	render: render({ FilteredSearchCustomButtonGroup }, `
    <div class="max-w-xl">
      <FilteredSearchCustomButtonGroup />
    </div>
  `),
};
