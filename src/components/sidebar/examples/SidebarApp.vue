<script setup lang="ts">
import type { SidebarProps } from 'shonk-ui';
import {
  CalendarIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  Settings2Icon,
  User2Icon,
} from '@lucide/vue';
import {
  Separator,
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from 'shonk-ui';

defineProps<SidebarProps>();

const items = [
  { title: 'Home', icon: HomeIcon, badge: '' },
  { title: 'Inbox', icon: InboxIcon, badge: '12' },
  { title: 'Calendar', icon: CalendarIcon, badge: '' },
  { title: 'Search', icon: SearchIcon, badge: '' },
  { title: 'Settings', icon: Settings2Icon, badge: '' },
];
</script>

<template>
  <SidebarProvider>
    <Sidebar v-bind="$props">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
              <span>Account</span>
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
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div class="bg-muted/50 min-h-[40vh] flex-1 rounded-xl" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
