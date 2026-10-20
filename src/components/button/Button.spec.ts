import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { Button } from '.';

describe('button', () => {
	it('should stay a plain button without a pressed model', () => {
		const wrapper = mount(Button, { slots: { default: 'Save' } });

		expect(wrapper.get('button').attributes('aria-pressed')).toBeUndefined();
	});

	it('should flip the pressed model on click', async () => {
		const pressed = ref(false);
		const wrapper = mount(Button, {
			props: { 'pressed': pressed.value, 'onUpdate:pressed': (value: boolean | undefined) => (pressed.value = value ?? false) },
			slots: { default: 'Bold' },
		});

		await wrapper.get('button').trigger('click');
		await wrapper.setProps({ pressed: pressed.value });

		expect(pressed.value).toBe(true);
		expect(wrapper.get('button').attributes('aria-pressed')).toBe('true');
	});
});
