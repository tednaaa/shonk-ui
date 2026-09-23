import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Select, SelectTrigger, SelectValue } from '.';
import { Label } from '../label';

function mountTrigger(size?: 'sm' | 'md') {
  const Host = defineComponent({
    components: { Select, SelectTrigger, SelectValue },
    props: { size: { type: String, default: undefined } },
    template: `
      <Select>
        <SelectTrigger :size="size">
          <SelectValue placeholder="Nothing selected" />
        </SelectTrigger>
      </Select>
    `,
  });

  return mount(Host, { props: { size } }).get('[data-slot="select-trigger"]');
}

describe('selectTrigger', () => {
  it('should fall back to the md size', () => {
    expect(mountTrigger().attributes('data-size')).toBe('md');
  });

  it('should keep an explicit size', () => {
    expect(mountTrigger('sm').attributes('data-size')).toBe('sm');
  });

  describe('attributes', () => {
    enableAutoUnmount(afterEach);

    function mountLabelledSelect() {
      const Host = defineComponent({
        components: { Label, Select, SelectTrigger, SelectValue },
        template: `
          <Label for="page-size">Rows per page</Label>
          <Select>
            <SelectTrigger
              id="page-size"
              aria-label="Page size"
              aria-describedby="page-size-hint"
              data-slot="page-size-trigger"
              class="w-full"
            >
              <SelectValue />
            </SelectTrigger>
          </Select>
        `,
      });

      return mount(Host, { attachTo: document.body });
    }

    it('should pass the attributes to the trigger button and keep the class on the wrapper', () => {
      const wrapper = mountLabelledSelect();
      const button = wrapper.get('button');

      expect(button.attributes()).toMatchObject({ 'id': 'page-size', 'aria-label': 'Page size', 'aria-describedby': 'page-size-hint', 'data-slot': 'select-trigger' });
      expect(button.element.parentElement?.getAttributeNames()).toEqual(['class']);
      expect(button.element.parentElement?.classList).toContain('w-full');
    });

    it('should let a label point at the trigger button', () => {
      const wrapper = mountLabelledSelect();

      expect(document.querySelector('label')?.control).toBe(wrapper.get('button').element);
    });
  });
});
