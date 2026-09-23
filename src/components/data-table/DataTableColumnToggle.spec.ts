import type { DataTableColumn, DataTableColumnVisibilityState } from './types';
import { DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { selectColumn } from './columns/selectColumn';
import DataTable from './DataTable.vue';
import DataTableColumnToggle from './DataTableColumnToggle.vue';
import { useDataTable } from './useDataTable';

interface Employee {
  id: string;
  name: string;
  age: number;
  city: string;
  phone: string;
}

const employees: Employee[] = [{ id: 'ada', name: 'Ada', age: 36, city: 'London', phone: '+44 20 0000' }];

const columns: DataTableColumn<Employee>[] = [
  selectColumn(),
  { accessorKey: 'name', header: 'Name', hideable: false },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City', label: 'City of residence' },
  { accessorKey: 'phone', header: 'Phone' },
];

enableAutoUnmount(afterEach);

function mountToggle(visibility: DataTableColumnVisibilityState = {}, toggle = '<DataTableColumnToggle v-model:open="open" :table="table" />') {
  const columnVisibility = ref(visibility);
  const open = ref(false);

  const Host = defineComponent({
    components: { DataTable, DataTableColumnToggle },
    setup() {
      return { table: useDataTable({ data: employees, columns, getRowId: employee => employee.id, columnVisibility }), open };
    },
    template: `
      <div>
        ${toggle}
        <DataTable :table="table" />
      </div>
    `,
  });

  const wrapper = mount(Host, { attachTo: document.body });

  return { wrapper, columnVisibility, open };
}

type Wrapper = ReturnType<typeof mountToggle>['wrapper'];

const body = new DOMWrapper(document.body);

async function openToggle(wrapper: Wrapper) {
  await wrapper.getElementByText('button', 'Columns').trigger('click');
  await flushPromises();
}

function fields() {
  return body.findAll('[data-slot="command-item"]');
}

function fieldLabels() {
  return fields().map(field => field.text());
}

function field(label: string) {
  return body.getElementByText('[data-slot="command-item"]', label);
}

function headers(wrapper: Wrapper) {
  return wrapper.findAll('th').map(header => header.text());
}

function showAllButton() {
  return body.getElementByText('[data-slot="popover-content"] button', 'Show all');
}

describe('dataTableColumnToggle', () => {
  it('should open from its button and report the open state', async () => {
    const { wrapper, open } = mountToggle();

    await openToggle(wrapper);

    expect(open.value).toBe(true);
    expect(body.get('[data-slot="command-input"]').attributes('placeholder')).toBe('Find a column…');
  });

  it('should open when the open state is set from outside', async () => {
    const { open } = mountToggle();

    open.value = true;
    await flushPromises();

    expect(fields()).not.toHaveLength(0);
  });

  it('should open from a trigger passed in the slot', async () => {
    const { wrapper } = mountToggle({}, `
      <DataTableColumnToggle :table="table">
        <template #trigger><button type="button">Configure columns</button></template>
      </DataTableColumnToggle>
    `);

    expect(wrapper.findElementByText('button', 'Columns')).toBeUndefined();

    await wrapper.getElementByText('button', 'Configure columns').trigger('click');
    await flushPromises();

    expect(fields()).not.toHaveLength(0);
  });

  it('should list the hideable columns by label and leave out the select column and the columns that cannot be hidden', async () => {
    const { wrapper } = mountToggle();

    await openToggle(wrapper);

    expect(fieldLabels()).toEqual(['Age', 'City of residence', 'Phone']);
  });

  it('should hide and show a column as soon as its field is clicked', async () => {
    const { wrapper, columnVisibility } = mountToggle();

    await openToggle(wrapper);
    await field('Age').trigger('click');

    expect(headers(wrapper)).not.toContain('Age');
    expect(columnVisibility.value).toMatchObject({ age: false, city: true, phone: true });
    expect(field('Age').attributes('aria-selected')).toBe('false');
    expect(field('Age').get('[data-slot="checkbox"]').attributes('data-state')).toBe('unchecked');

    await field('Age').trigger('click');

    expect(headers(wrapper)).toContain('Age');
    expect(columnVisibility.value).toMatchObject({ age: true });
  });

  it('should leave the visibility of the columns it does not list as the page set it', async () => {
    const { wrapper, columnVisibility } = mountToggle({ name: false });

    await openToggle(wrapper);
    await field('Age').trigger('click');

    expect(columnVisibility.value).toMatchObject({ name: false, age: false });
    expect(headers(wrapper)).not.toContain('Name');
  });

  it('should keep only the fields matching the search and keep the search after a click', async () => {
    const { wrapper, columnVisibility } = mountToggle();

    await openToggle(wrapper);
    await body.get('[data-slot="command-input"]').setValue('pho');

    expect(fieldLabels()).toEqual(['Phone']);

    await field('Phone').trigger('click');

    expect(columnVisibility.value).toMatchObject({ phone: false });
    expect(fieldLabels()).toEqual(['Phone']);
  });

  it('should say when no field matches the search', async () => {
    const { wrapper } = mountToggle();

    await openToggle(wrapper);
    await body.get('[data-slot="command-input"]').setValue('email');

    expect(fields()).toHaveLength(0);
    expect(body.get('[data-slot="command-empty"]').text()).toBe('No columns found');
  });

  it('should count the visible fields and show every hidden one at once', async () => {
    const { wrapper, columnVisibility } = mountToggle({ age: false, phone: false });

    await openToggle(wrapper);

    expect(body.get('[data-slot="popover-content"]').text()).toContain('1 of 3');

    await showAllButton().trigger('click');

    expect(headers(wrapper)).toEqual(expect.arrayContaining(['Age', 'City', 'Phone']));
    expect(columnVisibility.value).toMatchObject({ age: true, city: true, phone: true });
    expect(body.get('[data-slot="popover-content"]').text()).toContain('3 of 3');
    expect(showAllButton().attributes('disabled')).toBeDefined();
  });

  it('should keep the last visible field from being hidden', async () => {
    const { wrapper, columnVisibility } = mountToggle({ age: false, city: false });

    await openToggle(wrapper);

    expect(field('Phone').attributes('data-disabled')).toBeDefined();

    await field('Phone').trigger('click');

    expect(headers(wrapper)).toContain('Phone');

    await field('Age').trigger('click');

    expect(columnVisibility.value).toMatchObject({ age: true, phone: true });
    expect(field('Phone').attributes('data-disabled')).toBeUndefined();
  });
});
