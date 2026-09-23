import type { PartialShonkLocale } from '@/locales';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { shonkUI } from '@/plugin';
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '.';

function mountPagination(template: string, locale?: PartialShonkLocale) {
  const Host = defineComponent({
    components: { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious },
    template: `
      <Pagination :total="100" :items-per-page="10">
        <PaginationContent>${template}</PaginationContent>
      </Pagination>
    `,
  });

  return mount(Host, { global: { plugins: [[shonkUI, { locale }]] } });
}

function buttonNames(wrapper: ReturnType<typeof mountPagination>) {
  return wrapper.findAll('button').map(button => button.attributes('aria-label'));
}

describe('pagination', () => {
  it('should name the navigation buttons in the kit locale', () => {
    const wrapper = mountPagination('<PaginationFirst /><PaginationPrevious /><PaginationNext /><PaginationLast />');

    expect(buttonNames(wrapper)).toEqual(['First', 'Previous', 'Next', 'Last']);
  });

  it('should name a navigation button after its text and keep the name with an icon in the slot', () => {
    const wrapper = mountPagination('<PaginationPrevious button-text="Back" /><PaginationNext><i /></PaginationNext>');

    expect(buttonNames(wrapper)).toEqual(['Back', 'Next']);
  });

  it('should name the navigation and the page buttons in the kit locale', () => {
    const wrapper = mountPagination('<PaginationItem :value="3">3</PaginationItem>');

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Pages');
    expect(buttonNames(wrapper)).toEqual(['Page 3']);
  });

  it('should name a page button with the function from the app locale', () => {
    const wrapper = mountPagination(
      '<PaginationItem :value="3">3</PaginationItem>',
      { pagination: { pageButtonAriaLabel: page => `Sheet ${page}` } },
    );

    expect(buttonNames(wrapper)).toEqual(['Sheet 3']);
  });

  it('should prefer a page button name passed from outside to the locale', () => {
    const wrapper = mountPagination('<PaginationItem :value="3" aria-label="Last loaded">3</PaginationItem>');

    expect(buttonNames(wrapper)).toEqual(['Last loaded']);
  });
});
