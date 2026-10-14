import { mount } from '@vue/test-utils';
import { InputPassword } from '.';

describe('inputPassword', () => {
	it('should pass attributes and listeners to the input', async () => {
		const onBlur = vi.fn();
		const wrapper = mount(InputPassword, {
			props: { name: 'password' },
			attrs: { autocomplete: 'current-password', onBlur },
		});

		await wrapper.get('input').trigger('blur');

		expect(wrapper.get('input').attributes('autocomplete')).toBe('current-password');
		expect(onBlur).toHaveBeenCalled();
	});
});
