import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { Avatar, AvatarFallback } from '.';

describe('avatarFallback', () => {
	it.each([
		['monster', 'MO'],
		['john doe', 'JD'],
	])('should show the initials of %s', (name, initials) => {
		const wrapper = mount(Avatar, { slots: { default: () => h(AvatarFallback, { name }) } });

		expect(wrapper.text()).toBe(initials);
	});
});
