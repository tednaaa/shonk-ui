import type { VueWrapper } from '@vue/test-utils';
import type { PartialShonkLocale } from '@/locales';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { ru } from '@/locales';
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

function buttonNames(wrapper: VueWrapper) {
	return wrapper.findAll('button').map(button => button.attributes('aria-label'));
}

describe('pagination', () => {
	it('should name the navigation buttons in the kit locale', () => {
		const wrapper = mountPagination('<PaginationFirst /><PaginationPrevious /><PaginationNext /><PaginationLast />');

		expect(buttonNames(wrapper)).toEqual(['First', 'Previous', 'Next', 'Last']);
	});

	it('should name a navigation button after its text and keep the name with an icon in the slot', () => {
		const wrapper = mountPagination('<PaginationPrevious :locale="{ previousButtonText: \'Back\' }" /><PaginationNext><i /></PaginationNext>');

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

	it('should let one pagination override some locale strings for all its parts and keep the rest from the app locale', () => {
		const Host = defineComponent({
			components: { Pagination, PaginationContent, PaginationNext, PaginationPrevious },
			template: `
				<Pagination :total="100" :items-per-page="10" :locale="{ nextButtonText: 'Дальше' }">
					<PaginationContent><PaginationPrevious /><PaginationNext /></PaginationContent>
				</Pagination>
			`,
		});
		const wrapper = mount(Host, { global: { plugins: [[shonkUI, { locale: ru }]] } });

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Страницы');
		expect(buttonNames(wrapper)).toEqual(['Назад', 'Дальше']);
	});
});
