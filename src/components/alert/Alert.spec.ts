import { CheckCircle2Icon, CircleAlertIcon, InfoIcon, TriangleAlertIcon } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { Alert } from '.';

describe('alert', () => {
  it.each([
    ['info', InfoIcon],
    ['success', CheckCircle2Icon],
    ['warning', TriangleAlertIcon],
    ['destructive', CircleAlertIcon],
  ] as const)('should render the icon of the %s variant', (variant, icon) => {
    const wrapper = mount(Alert, { props: { variant, title: 'Heads up!' } });

    expect(wrapper.findComponent(icon).exists()).toBe(true);
  });

  it('should render no icon for the default variant', () => {
    const wrapper = mount(Alert, { props: { title: 'Heads up!' } });

    expect(wrapper.find('svg').exists()).toBe(false);
  });
});
