<script setup lang="ts">
import type { SidebarProps } from 'shonk-ui';
import { CalendarIcon, HomeIcon, InboxIcon } from '@lucide/vue';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarToggleButton,
} from 'shonk-ui';

defineProps<SidebarProps>();

const items = [
  { title: 'Home', icon: HomeIcon },
  { title: 'Inbox', icon: InboxIcon },
  { title: 'Calendar', icon: CalendarIcon },
];
</script>

<template>
  <SidebarProvider>
    <Sidebar v-bind="$props">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton :tooltip="item.title" :is-active="item.title === 'Home'">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarToggleButton />
    </Sidebar>
    <SidebarInset>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="min-h-[40vh] flex-1 rounded-xl bg-muted/50" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
