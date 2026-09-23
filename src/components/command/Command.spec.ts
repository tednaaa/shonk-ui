import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '.';

enableAutoUnmount(afterEach);

function mountCommand(multiple: boolean) {
  const Host = defineComponent({
    components: { Command, CommandGroup, CommandInput, CommandItem, CommandList },
    setup() {
      return { multiple };
    },
    template: `
      <Command :multiple="multiple">
        <CommandInput />
        <CommandList>
          <CommandGroup>
            <CommandItem value="calls">Calls</CommandItem>
            <CommandItem value="call-date">Call date</CommandItem>
            <CommandItem value="site">Website</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    `,
  });

  return mount(Host, { attachTo: document.body });
}

type Wrapper = ReturnType<typeof mountCommand>;

function itemTexts(wrapper: Wrapper) {
  return wrapper.findAll('[data-slot="command-item"]').map(item => item.text());
}

async function searchAndSelect(wrapper: Wrapper, search: string, itemText: string) {
  const input = wrapper.get('input');

  await input.setValue(search);

  await wrapper.getElementByText('[data-slot="command-item"]', itemText).trigger('click');

  return input;
}

describe('command', () => {
  it('should clear the search after an item is selected', async () => {
    const wrapper = mountCommand(false);

    const input = await searchAndSelect(wrapper, 'call', 'Calls');

    expect(input.element.value).toBe('');
    expect(itemTexts(wrapper)).toEqual(['Calls', 'Call date', 'Website']);
  });

  it('should keep the search after an item is toggled in a multiple selection', async () => {
    const wrapper = mountCommand(true);

    const input = await searchAndSelect(wrapper, 'call', 'Calls');

    expect(input.element.value).toBe('call');
    expect(itemTexts(wrapper)).toEqual(['Calls', 'Call date']);
  });
});
