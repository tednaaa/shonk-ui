import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import { Input } from '.';

describe('input', () => {
  it('should show the bound value', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } });

    expect(wrapper.get('input').element.value).toBe('hello');
  });

  it('should show the default value without a bound one', () => {
    const wrapper = mount(Input, { props: { defaultValue: 'hello' } });

    expect(wrapper.get('input').element.value).toBe('hello');
  });

  it('should emit the typed value', async () => {
    const wrapper = mount(Input);

    await wrapper.get('input').setValue('typed');

    expect(wrapper.emitted('update:modelValue')).toEqual([['typed']]);
  });

  it('should keep the typed value without a bound one', async () => {
    const wrapper = mount(Input, { props: { defaultValue: 'hello' } });

    await wrapper.get('input').setValue('typed');

    expect(wrapper.get('input').element.value).toBe('typed');
  });

  it('should follow the bound value when it changes', async () => {
    const model = ref('hello');
    const wrapper = mount(() => h(Input, { modelValue: model.value }));

    model.value = 'changed';
    await wrapper.vm.$nextTick();

    expect(wrapper.get('input').element.value).toBe('changed');
  });

  it('should mark the invalid state', () => {
    const wrapper = mount(Input, { props: { invalid: true } });

    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
  });
});
