import type { ShonkLocale } from './types';

export const en: ShonkLocale = {
  intlLocale: 'en-US',

  breadcrumb: {
    navAriaLabel: 'breadcrumb',
    ellipsisScreenReaderText: 'More',
  },

  carousel: {
    previousButtonScreenReaderText: 'Previous Slide',
    nextButtonScreenReaderText: 'Next Slide',
  },

  combobox: {
    triggerPlaceholder: 'Select…',
    searchPlaceholder: 'Search…',
    emptyText: 'No results found.',
    loadingText: 'Loading…',
    clearButtonAriaLabel: 'Clear selection',
  },

  command: {
    screenReaderTitle: 'Command Palette',
    screenReaderDescription: 'Search for a command to run...',
  },

  confirmDialog: {
    title: 'Confirm',
    cancelButtonText: 'Cancel',
  },

  dataTable: {
    emptyText: 'No data',
    pageSizeLabel: 'Rows per page',
  },

  datePicker: {
    triggerPlaceholder: 'Pick a date',
  },

  dialog: {
    closeButtonAriaLabel: 'Close',
  },

  filteredSearch: {
    placeholder: 'Search or filter…',
    addFilterPlaceholder: 'Add filter…',
    selectOperatorPlaceholder: 'Select operator…',
    enterValuePlaceholder: 'Enter value…',
    emptyText: 'No filters found.',
    valueHintText: 'Type a value and press Enter to confirm',
    applyButtonText: 'Apply',
    historyButtonAriaLabel: 'Toggle search history',
    historyHeaderText: 'Recent searches',
    historyEmptyText: 'You don\'t have any recent searches',
    historyItemAriaLabel: search => `Select recent search: ${search}`,
    clearHistoryButtonText: 'Clear recent searches',
    backButtonAriaLabel: 'Go back',
    clearButtonAriaLabel: 'Clear all filters',
    removeSearchButtonAriaLabel: 'Remove search',
    removeFilterButtonAriaLabel: filter => `Remove ${filter} filter`,
  },

  inputPassword: {
    showPasswordAriaLabel: 'Show password',
    hidePasswordAriaLabel: 'Hide password',
  },

  pagination: {
    navAriaLabel: 'Pages',
    pageButtonAriaLabel: page => `Page ${page}`,
    firstButtonText: 'First',
    previousButtonText: 'Previous',
    nextButtonText: 'Next',
    lastButtonText: 'Last',
    ellipsisScreenReaderText: 'More pages',
  },

  rangeDatePicker: {
    triggerPlaceholder: 'Pick a date range',
  },

  select: {
    clearButtonAriaLabel: 'Clear selection',
  },

  sheet: {
    closeButtonScreenReaderText: 'Close',
  },

  sidebar: {
    toggleAriaLabel: 'Toggle Sidebar',
    mobileScreenReaderTitle: 'Sidebar',
    mobileScreenReaderDescription: 'Displays the mobile sidebar.',
  },

  spinner: {
    ariaLabel: 'Loading',
  },
};
