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

	codeBlock: {
		copyButtonAriaLabel: 'Copy',
		copiedText: 'Copied',
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
		selectPageRowsLabel: 'Select all rows on the page',
		selectRowLabel: 'Select row',
		expandAllRowsLabel: 'Expand all rows',
		collapseAllRowsLabel: 'Collapse all rows',
		expandRowLabel: 'Expand row',
		columnToggleButtonText: 'Columns',
		columnToggleSearchPlaceholder: 'Find a column…',
		columnToggleEmptyText: 'No columns found',
		columnToggleShowAllButtonText: 'Show all',
		columnToggleHideAllButtonText: 'Hide all',
		columnToggleVisibleCountText: (visible, total) => `${visible} of ${total}`,
		exportButtonText: 'Download',
		exportFileName: 'table',
	},

	datePicker: {
		triggerPlaceholder: 'Pick a date',
	},

	dialog: {
		closeButtonAriaLabel: 'Close',
	},

	fileUpload: {
		dropzoneTitle: 'Drop files here',
		dropzoneHint: 'or click to browse',
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
		editFilterButtonAriaLabel: filter => `Edit ${filter} filter`,
		changeOperatorButtonAriaLabel: filter => `Change ${filter} operator`,
		changeKeyButtonAriaLabel: filter => `Change ${filter} filter type`,
	},

	inputPassword: {
		showPasswordAriaLabel: 'Show password',
		hidePasswordAriaLabel: 'Hide password',
	},

	messageScroller: {
		viewportAriaLabel: 'Messages',
		scrollToEndText: 'Scroll to end',
		scrollToStartText: 'Scroll to start',
	},

	multiCombobox: {
		allText: 'All',
		selectedCountText: selected => `${selected} selected`,
		selectAllText: 'Select all',
		resetButtonText: 'Reset',
		allSelectedCountText: total => `All selected · ${total}`,
		selectedOfTotalText: (selected, total) => `${selected} of ${total} selected`,
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
