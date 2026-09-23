import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { FilterDefinition } from './types';
import { example, render, showControls } from '@/lib/storybook';
import { FilteredSearch } from '.';
import FilteredSearchControlled from './examples/FilteredSearchControlled.vue';
import filteredSearchControlledSource from './examples/FilteredSearchControlled.vue?raw';
import FilteredSearchCustomEditor from './examples/FilteredSearchCustomEditor.vue';
import filteredSearchCustomEditorSource from './examples/FilteredSearchCustomEditor.vue?raw';
import FilteredSearchHistory from './examples/FilteredSearchHistory.vue';
import filteredSearchHistorySource from './examples/FilteredSearchHistory.vue?raw';
import FilteredSearchIcons from './examples/FilteredSearchIcons.vue';
import filteredSearchIconsSource from './examples/FilteredSearchIcons.vue?raw';
import FilteredSearchMultiSelect from './examples/FilteredSearchMultiSelect.vue';
import filteredSearchMultiSelectSource from './examples/FilteredSearchMultiSelect.vue?raw';
import FilteredSearchOptions from './examples/FilteredSearchOptions.vue';
import filteredSearchOptionsSource from './examples/FilteredSearchOptions.vue?raw';
import FilteredSearchSuffix from './examples/FilteredSearchSuffix.vue';
import filteredSearchSuffixSource from './examples/FilteredSearchSuffix.vue?raw';
import FilteredSearchUnique from './examples/FilteredSearchUnique.vue';
import filteredSearchUniqueSource from './examples/FilteredSearchUnique.vue?raw';
import FilteredSearchViewOnly from './examples/FilteredSearchViewOnly.vue';
import filteredSearchViewOnlySource from './examples/FilteredSearchViewOnly.vue?raw';
import FilteredSearchWrapped from './examples/FilteredSearchWrapped.vue';
import filteredSearchWrappedSource from './examples/FilteredSearchWrapped.vue?raw';

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
  title: 'Components/FilteredSearch',
  component: FilteredSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A filter bar the application fills with its own vocabulary. The kit ships no operators: every entry of a definition\'s `operators` is yours, so `{ value: \'equals\', label: \'is\' }` and `{ value: \'=\', label: \'is\' }` are equally valid and neither name is interpreted. A definition\'s `icon` and `editor` come from the app the same way. What the kit owns is the chrome — the token list, the suggestions, focus and the keyboard. Give a definition `options` and the kit suggests them; add `multiSelect` and it gathers several into one token; hand it an `editor` component and that replaces the value step outright, keyboard included. `unique` drops a definition from the list once it has been applied, `viewOnly` renders the bar without any way to change it, and `historyItems` is app-owned too — the kit shows recent searches and emits `clearHistory`, but never writes the list.',
      },
    },
  },
  render: args => ({
    components: { FilteredSearch },
    setup: () => ({ args, definitions }),
    template: `<div class="max-w-xl"><FilteredSearch v-bind="args" :definitions="definitions" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const NotSearchable: Story = {
  args: { searchable: false, placeholder: 'Filter…' },
};

export const WithIcons: Story = {
  parameters: example(filteredSearchIconsSource),
  render: render({ FilteredSearchIcons }, `<div class="max-w-xl"><FilteredSearchIcons /></div>`),
};

export const WithOptions: Story = {
  parameters: example(filteredSearchOptionsSource),
  render: render({ FilteredSearchOptions }, `<div class="max-w-xl"><FilteredSearchOptions /></div>`),
};

export const WithMultiSelect: Story = {
  parameters: example(filteredSearchMultiSelectSource),
  render: render({ FilteredSearchMultiSelect }, `<div class="max-w-xl"><FilteredSearchMultiSelect /></div>`),
};

export const WithHistoryItems: Story = {
  parameters: example(filteredSearchHistorySource),
  render: render({ FilteredSearchHistory }, `<div class="max-w-xl"><FilteredSearchHistory /></div>`),
};

export const ViewOnly: Story = {
  parameters: example(filteredSearchViewOnlySource),
  render: render({ FilteredSearchViewOnly }, `<div class="max-w-xl"><FilteredSearchViewOnly /></div>`),
};

export const Unique: Story = {
  parameters: example(filteredSearchUniqueSource),
  render: render({ FilteredSearchUnique }, `<div class="max-w-xl"><FilteredSearchUnique /></div>`),
};

export const CustomEditor: Story = {
  parameters: example(filteredSearchCustomEditorSource),
  render: render({ FilteredSearchCustomEditor }, `<div class="max-w-xl"><FilteredSearchCustomEditor /></div>`),
};

export const Wrapped: Story = {
  parameters: example(filteredSearchWrappedSource),
  render: render({ FilteredSearchWrapped }, `<div class="max-w-md"><FilteredSearchWrapped /></div>`),
};

export const WithSuffix: Story = {
  parameters: example(filteredSearchSuffixSource),
  render: render({ FilteredSearchSuffix }, `<div class="max-w-xl"><FilteredSearchSuffix /></div>`),
};

export const Controlled: Story = {
  parameters: example(filteredSearchControlledSource),
  render: render({ FilteredSearchControlled }, `<div class="max-w-xl"><FilteredSearchControlled /></div>`),
};
