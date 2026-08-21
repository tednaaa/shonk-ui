export interface ShonkLocale {
  code: string;

  breadcrumb: {
    label: string;
    more: string;
  };

  carousel: {
    previous: string;
    next: string;
  };

  combobox: {
    placeholder: string;
    search: string;
    empty: string;
    loading: string;
    clear: string;
  };

  command: {
    title: string;
    description: string;
  };

  confirmDialog: {
    title: string;
    cancel: string;
  };

  datePicker: {
    placeholder: string;
  };

  dialog: {
    close: string;
  };

  inputPassword: {
    show: string;
    hide: string;
  };

  pagination: {
    first: string;
    previous: string;
    next: string;
    last: string;
    morePages: string;
  };

  rangeDatePicker: {
    placeholder: string;
  };

  select: {
    clear: string;
  };

  sheet: {
    close: string;
  };

  sidebar: {
    toggle: string;
    title: string;
    description: string;
  };

  spinner: {
    loading: string;
  };
}

export type PartialShonkLocale = {
  [K in keyof ShonkLocale]?: ShonkLocale[K] extends string ? ShonkLocale[K] : Partial<ShonkLocale[K]>;
};
