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
import { ref } from 'vue';
import { render, showControls } from '@/lib/storybook';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '.';

const components = {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
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

const trigger = `<ContextMenuTrigger class="border-border-default text-text-secondary flex h-37.5 w-75 items-center justify-center rounded-md border border-dashed text-sm select-none">
        Right click here
      </ContextMenuTrigger>`;

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  render: render(
    components,
    `<ContextMenu v-bind="args">
      ${trigger}
      <ContextMenuContent class="w-64">
        <ContextMenuLabel>My Account</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem><UserIcon />Profile<ContextMenuShortcut>⇧⌘P</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><CreditCardIcon />Billing<ContextMenuShortcut>⌘B</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><SettingsIcon />Settings<ContextMenuShortcut>⌘S</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><KeyboardIcon />Keyboard shortcuts<ContextMenuShortcut>⌘K</ContextMenuShortcut></ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive"><LogOutIcon />Log out<ContextMenuShortcut>⇧⌘Q</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithCheckboxItems: Story = {
  render: () => ({
    components,
    setup() {
      const showStatusBar = ref(true);
      const showActivityBar = ref(false);
      const showPanel = ref(false);
      return { showStatusBar, showActivityBar, showPanel };
    },
    template: `
      <ContextMenu>
        ${trigger}
        <ContextMenuContent class="w-64">
          <ContextMenuLabel>Appearance</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem v-model="showStatusBar">Status Bar</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem v-model="showActivityBar">Activity Bar</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem v-model="showPanel">Panel</ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
};

export const WithRadioItems: Story = {
  render: () => ({
    components,
    setup() {
      const position = ref('bottom');
      return { position };
    },
    template: `
      <ContextMenu>
        ${trigger}
        <ContextMenuContent class="w-64">
          <ContextMenuLabel>Panel Position</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup v-model="position">
            <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
            <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
            <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
};

export const WithSubmenu: Story = {
  render: render(
    components,
    `<ContextMenu v-bind="args">
      ${trigger}
      <ContextMenuContent class="w-64">
        <ContextMenuLabel>Team</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem><UsersIcon />Members</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger><UserPlusIcon />Invite users</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem><MailIcon />Email</ContextMenuItem>
            <ContextMenuItem><MessageSquareIcon />Message</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem><PlusCircleIcon />More…</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>`,
  ),
};

export const Disabled: Story = {
  render: render(
    components,
    `<ContextMenu v-bind="args">
      ${trigger}
      <ContextMenuContent class="w-64">
        <ContextMenuItem><UserIcon />Profile</ContextMenuItem>
        <ContextMenuItem disabled><CreditCardIcon />Billing</ContextMenuItem>
        <ContextMenuItem><SettingsIcon />Settings</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>`,
  ),
};
