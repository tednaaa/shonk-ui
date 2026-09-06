<script setup lang="ts">
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from '@lucide/vue';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from 'shonk-ui';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <Button variant="outline" @click="open = true">Open command menu</Button>

  <CommandDialog v-model:open="open">
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
  </CommandDialog>
</template>
