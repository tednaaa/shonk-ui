import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '.';

const components = {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'account',
  },
  render: render(
    components,
    `<div class="max-w-md">
      <Tabs v-bind="args">
        <TabsList class="w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" class="text-text-tertiary text-sm">
          Make changes to your account here. Click save when you're done.
        </TabsContent>
        <TabsContent value="password" class="text-text-tertiary text-sm">
          Change your password here. After saving, you'll be logged out.
        </TabsContent>
      </Tabs>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const DisabledTab: Story = {
  render: render(
    components,
    `<div class="max-w-md">
      <Tabs default-value="overview">
        <TabsList class="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="text-text-tertiary text-sm">Overview of your workspace.</TabsContent>
        <TabsContent value="analytics" class="text-text-tertiary text-sm">Analytics for the last 30 days.</TabsContent>
        <TabsContent value="reports" class="text-text-tertiary text-sm">Reports are not available on your plan.</TabsContent>
      </Tabs>
    </div>`,
  ),
};
