import { mount } from '@vue/test-utils';
import { AttachmentTrigger } from '.';

describe('attachmentTrigger', () => {
	it('should render the element passed in as', () => {
		const wrapper = mount(AttachmentTrigger, {
			props: { as: 'a' },
			attrs: { 'href': '/report.pdf', 'aria-label': 'Open report.pdf' },
		});

		expect(wrapper.get('a[aria-label="Open report.pdf"]').attributes('href')).toBe('/report.pdf');
	});
});
