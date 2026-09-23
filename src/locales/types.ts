export interface ShonkLocale {
  intlLocale: string;

  breadcrumb: {
    navAriaLabel: string;
    ellipsisScreenReaderText: string;
  };

  carousel: {
    previousButtonScreenReaderText: string;
    nextButtonScreenReaderText: string;
  };

  combobox: {
    triggerPlaceholder: string;
    searchPlaceholder: string;
    emptyText: string;
    loadingText: string;
    clearButtonAriaLabel: string;
  };

  command: {
    screenReaderTitle: string;
    screenReaderDescription: string;
  };

  confirmDialog: {
    title: string;
    cancelButtonText: string;
  };

  datePicker: {
    triggerPlaceholder: string;
  };

  dialog: {
    closeButtonAriaLabel: string;
  };

  filteredSearch: {
    placeholder: string;
    addFilterPlaceholder: string;
    selectOperatorPlaceholder: string;
    enterValuePlaceholder: string;
    emptyText: string;
    valueHintText: string;
    applyButtonText: string;
    historyButtonAriaLabel: string;
    historyHeaderText: string;
    historyEmptyText: string;
    historyItemAriaLabel: (search: string) => string;
    clearHistoryButtonText: string;
    backButtonAriaLabel: string;
    clearButtonAriaLabel: string;
    removeSearchButtonAriaLabel: string;
    removeFilterButtonAriaLabel: (filter: string) => string;
  };

  inputPassword: {
    showPasswordAriaLabel: string;
    hidePasswordAriaLabel: string;
  };

  pagination: {
    navAriaLabel: string;
    pageButtonAriaLabel: (page: number) => string;
    firstButtonText: string;
    previousButtonText: string;
    nextButtonText: string;
    lastButtonText: string;
    ellipsisScreenReaderText: string;
  };

  rangeDatePicker: {
    triggerPlaceholder: string;
  };

  select: {
    clearButtonAriaLabel: string;
  };

  sheet: {
    closeButtonScreenReaderText: string;
  };

  sidebar: {
    toggleAriaLabel: string;
    mobileScreenReaderTitle: string;
    mobileScreenReaderDescription: string;
  };

  spinner: {
    ariaLabel: string;
  };
}

export type PartialShonkLocale = {
  [K in keyof ShonkLocale]?: ShonkLocale[K] extends string ? ShonkLocale[K] : Partial<ShonkLocale[K]>;
};
