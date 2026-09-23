import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import { NativeSelect, NativeSelectOption } from '.';

function options() {
  return [h(NativeSelectOption, { value: 'card' }, () => 'Card'), h(NativeSelectOption, { value: 'cash' }, () => 'Cash')];
}

describe('nativeSelect', () => {
  it('should select the bound value', () => {
    const wrapper = mount(NativeSelect, { props: { modelValue: 'cash' }, slots: { default: options } });

    expect(wrapper.get('select').element.value).toBe('cash');
  });

  it('should emit the picked value', async () => {
    const wrapper = mount(NativeSelect, { slots: { default: options } });

    await wrapper.get('select').setValue('cash');

    expect(wrapper.emitted('update:modelValue')).toEqual([['cash']]);
  });

  it('should keep the picked value without a bound one', async () => {
    const wrapper = mount(NativeSelect, { slots: { default: options } });

    await wrapper.get('select').setValue('cash');

    expect(wrapper.get('select').element.value).toBe('cash');
  });

  it('should forward attributes to the select', () => {
    const wrapper = mount(NativeSelect, { attrs: { 'disabled': true, 'aria-label': 'Payment' }, slots: { default: options } });

    expect(wrapper.get('select').attributes()).toMatchObject({ 'disabled': '', 'aria-label': 'Payment' });
  });

  it('should follow the bound value when it changes', async () => {
    const model = ref('card');
    const wrapper = mount(() => h(NativeSelect, { modelValue: model.value }, options));

    model.value = 'cash';
    await wrapper.vm.$nextTick();

    expect(wrapper.get('select').element.value).toBe('cash');
  });
});
