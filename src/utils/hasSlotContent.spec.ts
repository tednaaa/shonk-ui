import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { hasSlotContent } from './hasSlotContent';

const Host = defineComponent({ template: '<slot />' });

function slotFrom(slotTemplate: string) {
  const wrapper = mount(Host, { slots: { default: slotTemplate } });
  return wrapper.vm.$slots.default;
}

describe('hasSlotContent', () => {
  it('returns false for undefined slot', () => {
    expect(hasSlotContent(undefined)).toBe(false);
  });

  it('returns false for a single comment (v-if false)', () => {
    const slot = slotFrom('<span v-if="false">hidden</span>');
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns false for multiple comments', () => {
    const slot = slotFrom('<span v-if="false">a</span><span v-if="false">b</span>');
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns false for a fragment containing only a comment', () => {
    const slot = slotFrom('<template v-if="false"> <span>hidden</span> </template>');
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns false for nested fragments with only comments', () => {
    const slot = slotFrom(`
      <template v-if="false">
        <template v-if="false"> <span>deep hidden</span> </template>
      </template>
    `);
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns true for a real element', () => {
    const slot = slotFrom('<div>visible</div>');
    expect(hasSlotContent(slot)).toBe(true);
  });

  it('returns true for a fragment with a real element', () => {
    const slot = slotFrom('<template v-if="true"> <ul><li>item</li></ul> </template>');
    expect(hasSlotContent(slot)).toBe(true);
  });

  it('returns false for an empty text node ({{ undefined }})', () => {
    const slot = slotFrom('{{ undefined }}');
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns false for a whitespace-only text node', () => {
    const slot = slotFrom('   ');
    expect(hasSlotContent(slot)).toBe(false);
  });

  it('returns true for a text node with content', () => {
    const slot = slotFrom('Error message');
    expect(hasSlotContent(slot)).toBe(true);
  });

  it('returns true for mixed comments and real elements', () => {
    const slot = slotFrom('<span v-if="false">hidden</span><span>visible</span>');
    expect(hasSlotContent(slot)).toBe(true);
  });

  it('returns true for nested fragments with real content', () => {
    const slot = slotFrom(`
      <template>
        <template v-if="false"><span>hidden</span></template>
        <template v-if="true"><p>visible</p></template>
      </template>
    `);
    expect(hasSlotContent(slot)).toBe(true);
  });

  it('returns true after reactive slot content changes from empty to real element', async () => {
    const error = ref('');

    const Parent = defineComponent({
      setup() { return { error }; },
      components: { Host },
      template: `
      <Host>
        <template #default>
          <span v-if="error">{{ error }}</span>
        </template>
      </Host>
      `,
    });

    const wrapper = mount(Parent);
    const hostVm = wrapper.findComponent(Host).vm;

    expect(hasSlotContent(hostVm.$slots.default)).toBe(false);

    error.value = 'Some error';
    await nextTick();

    expect(hasSlotContent(hostVm.$slots.default)).toBe(true);
  });
});
