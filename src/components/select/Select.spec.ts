import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Select, SelectTrigger, SelectValue } from '.';

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
});
