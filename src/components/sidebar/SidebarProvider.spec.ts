import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { Sidebar, SidebarProvider, SidebarTrigger } from '.';

function mountSidebar(props: Record<string, unknown> = {}) {
  return mount(SidebarProvider, {
    props,
    slots: { default: () => [h(Sidebar), h(SidebarTrigger)] },
  });
}

function sidebarState(wrapper: ReturnType<typeof mountSidebar>) {
  return wrapper.get('[data-slot="sidebar"][data-state]').attributes('data-state');
}

describe('sidebarProvider', () => {
  afterEach(() => {
    document.cookie = 'sidebar_state=; path=/; max-age=0';
  });

  it('should expand when no state is stored', () => {
    expect(sidebarState(mountSidebar())).toBe('expanded');
  });

  it('should restore the state stored after the page was loaded', () => {
    document.cookie = 'sidebar_state=false; path=/';

    expect(sidebarState(mountSidebar())).toBe('collapsed');
  });

  it('should store the state when toggled', async () => {
    const wrapper = mountSidebar();

    await wrapper.getElementByText('button', 'Toggle Sidebar').trigger('click');

    expect(sidebarState(wrapper)).toBe('collapsed');
    expect(document.cookie).toContain('sidebar_state=false');
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('should follow the bound open state over the stored one', () => {
    document.cookie = 'sidebar_state=true; path=/';

    expect(sidebarState(mountSidebar({ 'open': false, 'onUpdate:open': vi.fn() }))).toBe('collapsed');
  });
});
