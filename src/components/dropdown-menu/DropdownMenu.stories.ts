import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CreditCardIcon,
  KeyboardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from '@lucide/vue';
import { example, render, showControls } from '@/lib/storybook';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '.';
import { Button } from '../button';
import DropdownMenuWithCheckboxItems from './examples/DropdownMenuWithCheckboxItems.vue';
import dropdownMenuWithCheckboxItemsSource from './examples/DropdownMenuWithCheckboxItems.vue?raw';
import DropdownMenuWithRadioItems from './examples/DropdownMenuWithRadioItems.vue';
import dropdownMenuWithRadioItemsSource from './examples/DropdownMenuWithRadioItems.vue?raw';

const components = {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Button,
  CreditCardIcon,
  KeyboardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
};

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  render: render(
    components,
    `<DropdownMenu v-bind="args">
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />Profile<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />Billing<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />Settings<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyboardIcon />Keyboard shortcuts<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />Log out<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithCheckboxItems: Story = {
  parameters: example(dropdownMenuWithCheckboxItemsSource),
  render: render({ DropdownMenuWithCheckboxItems }, `<DropdownMenuWithCheckboxItems />`),
};

export const WithRadioItems: Story = {
  parameters: example(dropdownMenuWithRadioItemsSource),
  render: render({ DropdownMenuWithRadioItems }, `<DropdownMenuWithRadioItems />`),
};

export const WithSubmenu: Story = {
  render: render(
    components,
    `<DropdownMenu v-bind="args">
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuLabel>Team</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><UsersIcon />Members</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><UserPlusIcon />Invite users</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem><MailIcon />Email</DropdownMenuItem>
            <DropdownMenuItem><MessageSquareIcon />Message</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><PlusCircleIcon />More…</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>`,
  ),
};

export const Disabled: Story = {
  render: render(
    components,
    `<DropdownMenu v-bind="args">
      <DropdownMenuTrigger as-child>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuItem><UserIcon />Profile</DropdownMenuItem>
        <DropdownMenuItem disabled><CreditCardIcon />Billing</DropdownMenuItem>
        <DropdownMenuItem><SettingsIcon />Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>`,
  ),
};
