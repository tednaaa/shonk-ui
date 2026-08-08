import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from '@lucide/vue';
import { ref } from 'vue';
import { render, showControls } from '@/lib/storybook';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '.';
import { Button } from '../button';

const components = {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
};

const items = `
  <CommandInput placeholder="Type a command or search…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem value="calendar"><CalendarIcon />Calendar</CommandItem>
      <CommandItem value="emoji"><SmileIcon />Search Emoji</CommandItem>
      <CommandItem value="calculator"><CalculatorIcon />Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem value="profile"><UserIcon />Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
      <CommandItem value="billing"><CreditCardIcon />Billing<CommandShortcut>⌘B</CommandShortcut></CommandItem>
      <CommandItem value="settings"><SettingsIcon />Settings<CommandShortcut>⌘S</CommandShortcut></CommandItem>
    </CommandGroup>
  </CommandList>
`;

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
  render: render(
    components,
    `<Command v-bind="args" class="max-w-md rounded-lg border shadow-md">${items}</Command>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Dialog: Story = {
  render: () => ({
    components: { ...components, CommandDialog, Button },
    setup() {
      const open = ref(false);
      return { open };
    },
    template: `
      <Button variant="outline" @click="open = true">Open command menu</Button>
      <CommandDialog v-model:open="open">${items}</CommandDialog>
    `,
  }),
};
