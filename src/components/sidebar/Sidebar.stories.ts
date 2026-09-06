import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls } from '@/lib/storybook';
import { Sidebar } from '.';
import SidebarApp from './examples/SidebarApp.vue';
import sidebarAppSource from './examples/SidebarApp.vue?raw';
import SidebarSkeleton from './examples/SidebarSkeleton.vue';
import sidebarSkeletonSource from './examples/SidebarSkeleton.vue?raw';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: example(sidebarAppSource),
  render: render({ SidebarApp }, `<SidebarApp v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const IconCollapsible: Story = {
  args: { collapsible: 'icon' },
  parameters: example(
    sidebarAppSource,
    'With `collapsible="icon"` the sidebar shrinks to a rail of icons rather than sliding off canvas, so the `tooltip` on each `SidebarMenuButton` becomes the only remaining label.',
  ),
};

export const Floating: Story = {
  args: { variant: 'floating' },
  parameters: example(
    sidebarAppSource,
    'The `floating` variant detaches the sidebar from the viewport edge and gives it its own rounded, bordered surface.',
  ),
};

export const RightSide: Story = {
  args: { side: 'right' },
  parameters: example(
    sidebarAppSource,
    'Setting `side="right"` anchors the sidebar to the opposite edge; `SidebarInset` and `SidebarRail` follow it without further changes.',
  ),
};

export const Loading: Story = {
  parameters: example(
    sidebarSkeletonSource,
    'Fill the menu with `SidebarMenuSkeleton` while the navigation is still being fetched. `show-icon` reserves room for the icon so nothing shifts once the real items arrive.',
  ),
  render: render({ SidebarSkeleton }, `<SidebarSkeleton />`),
};
