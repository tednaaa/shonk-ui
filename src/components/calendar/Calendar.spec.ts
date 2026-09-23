import { CalendarDate } from '@internationalized/date';
import { mount } from '@vue/test-utils';
import { Calendar } from '.';

function mountCalendar() {
  return mount(Calendar, { props: { layout: 'month-and-year', defaultPlaceholder: new CalendarDate(2026, 6, 1) } });
}

function shownMonth(wrapper: ReturnType<typeof mountCalendar>) {
  return wrapper.get('[data-slot="calendar"]').attributes('aria-label');
}

describe('calendar', () => {
  it('should show the month of the default placeholder', () => {
    expect(shownMonth(mountCalendar())).toContain('June 2026');
  });

  it('should show the month picked in the month select', async () => {
    const wrapper = mountCalendar();

    await wrapper.findAll('select')[0]?.setValue('9');

    expect(shownMonth(wrapper)).toContain('September 2026');
  });

  it('should show the year picked in the year select', async () => {
    const wrapper = mountCalendar();

    await wrapper.findAll('select')[1]?.setValue('1950');

    expect(shownMonth(wrapper)).toContain('June 1950');
  });

  it('should keep the year range around the default placeholder after a year is picked', async () => {
    const wrapper = mountCalendar();

    await wrapper.findAll('select')[1]?.setValue('1950');
    const years = wrapper.findAll('select')[1]?.findAll('option').map(option => option.attributes('value'));

    expect([years?.at(0), years?.at(-1)]).toEqual(['1926', '2036']);
  });

  it('should emit the placeholder when paging', async () => {
    const wrapper = mountCalendar();

    await wrapper.get('[aria-label="Next page"]').trigger('click');

    expect(wrapper.emitted('update:placeholder')?.[0]).toEqual([new CalendarDate(2026, 7, 1)]);
  });
});
