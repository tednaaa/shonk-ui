import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CalendarIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  Settings2Icon,
  User2Icon,
} from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '.';
import { Separator } from '../separator';

const items = [
  { title: 'Home', icon: HomeIcon, badge: '' },
  { title: 'Inbox', icon: InboxIcon, badge: '12' },
  { title: 'Calendar', icon: CalendarIcon, badge: '' },
  { title: 'Search', icon: SearchIcon, badge: '' },
  { title: 'Settings', icon: Settings2Icon, badge: '' },
];

const components = {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Separator,
  GalleryVerticalEndIcon,
  User2Icon,
};

const appTemplate = `
  <SidebarProvider>
    <Sidebar v-bind="args">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div class="bg-bg-brand text-text-inverse flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEndIcon class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Acme Inc</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton :tooltip="item.title" :is-active="item.title === 'Home'">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2Icon />
              <span>shadcn</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <span class="font-medium">Dashboard</span>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="bg-bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div class="bg-bg-muted/50 min-h-[40vh] flex-1 rounded-xl" />
      </div>
    </SidebarInset>
  </SidebarProvider>
`;

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  render: args => ({
    components,
    setup: () => ({ args, items }),
    template: appTemplate,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const IconCollapsible: Story = {
  args: { collapsible: 'icon' },
};

export const Floating: Story = {
  args: { variant: 'floating' },
};

export const RightSide: Story = {
  args: { side: 'right' },
};

export const Loading: Story = {
  render: render(
    components,
    `<SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="i in 5" :key="i">
                  <SidebarMenuSkeleton show-icon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>`,
  ),
};
