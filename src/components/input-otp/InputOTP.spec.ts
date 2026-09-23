import { mount } from '@vue/test-utils';
import { InputOTP, REGEXP_ONLY_DIGITS } from '.';

function mountInputOTP(props: InstanceType<typeof InputOTP>['$props'] = {}) {
  const wrapper = mount(InputOTP, { props: { length: 4, ...props }, attachTo: document.body });

  return { wrapper, boxes: wrapper.findAll('[data-slot="input-otp-slot"]') };
}

function paste(text: string) {
  return { clipboardData: { getData: () => text } };
}

describe('inputOTP', () => {
  it('should render a box per character', () => {
    const { boxes } = mountInputOTP({ length: 6 });

    expect(boxes).toHaveLength(6);
  });

  it('should show the default value across the boxes', () => {
    const { boxes } = mountInputOTP({ defaultValue: '12' });

    expect(boxes.map(box => (box.element as HTMLInputElement).value)).toEqual(['1', '2', '', '']);
  });

  it('should fill the focused box and move on to the next one', async () => {
    const { wrapper, boxes } = mountInputOTP();

    await boxes[0].setValue('1');

    expect(wrapper.emitted('update:modelValue')).toEqual([['1']]);
    expect(document.activeElement).toBe(boxes[1].element);
  });

  it('should clear the focused box on backspace and step back on the next one', async () => {
    const { wrapper, boxes } = mountInputOTP({ defaultValue: '12' });

    await boxes[1].trigger('keydown', { key: 'Backspace' });
    await boxes[1].trigger('keydown', { key: 'Backspace' });

    expect(wrapper.emitted('update:modelValue')).toEqual([['1'], ['']]);
    expect(document.activeElement).toBe(boxes[0].element);
  });

  it('should spread a pasted code across the boxes', async () => {
    const { wrapper, boxes } = mountInputOTP();

    await boxes[0].trigger('paste', paste('1234'));

    expect(wrapper.emitted('update:modelValue')).toEqual([['1234']]);
  });

  it('should reject a character the pattern does not match', async () => {
    const { wrapper, boxes } = mountInputOTP({ pattern: REGEXP_ONLY_DIGITS });

    await boxes[0].setValue('a');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect((boxes[0].element as HTMLInputElement).value).toBe('');
  });

  it('should run the paste transformer before the pattern judges the code', async () => {
    const { wrapper, boxes } = mountInputOTP({
      pattern: REGEXP_ONLY_DIGITS,
      pasteTransformer: pasted => pasted.replace(/\D/g, ''),
    });

    await boxes[0].trigger('paste', paste('Your code is 12-34. It expires in 10 minutes.'));

    expect(wrapper.emitted('update:modelValue')).toEqual([['1234']]);
  });

  it('should emit complete once the last box is filled', async () => {
    const { wrapper, boxes } = mountInputOTP({ length: 2 });

    await boxes[0].setValue('1');
    await boxes[1].setValue('2');
    await boxes[1].setValue('3');

    expect(wrapper.emitted('complete')).toEqual([['12']]);
  });
});
