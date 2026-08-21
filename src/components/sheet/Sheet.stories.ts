import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '.';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const components = {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Input,
  Label,
};

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  render: render(
    components,
    `<Sheet v-bind="args">
      <SheetTrigger as-child>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Manage how you receive notifications from us.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose as-child>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Sides: Story = {
  render: render(
    components,
    `<div class="flex flex-wrap gap-2">
      <Sheet v-for="side in ['top', 'right', 'bottom', 'left']" :key="side">
        <SheetTrigger as-child>
          <Button variant="outline" class="capitalize">{{ side }}</Button>
        </SheetTrigger>
        <SheetContent :side="side">
          <SheetHeader>
            <SheetTitle class="capitalize">{{ side }} sheet</SheetTitle>
            <SheetDescription>This sheet slides in from the {{ side }} edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>`,
  ),
};

export const WithForm: Story = {
  render: render(
    components,
    `<Sheet v-bind="args">
      <SheetTrigger as-child>
        <Button variant="outline">Edit profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <form class="flex flex-1 flex-col gap-4 overflow-y-auto" @submit.prevent>
          <div class="grid auto-rows-min gap-4 px-4">
            <div class="grid gap-2">
              <Label for="sheet-name">Name</Label>
              <Input id="sheet-name" default-value="Alex Doe" />
            </div>
            <div class="grid gap-2">
              <Label for="sheet-username">Username</Label>
              <Input id="sheet-username" default-value="@alexdoe" />
            </div>
          </div>
          <SheetFooter class="mt-auto">
            <Button type="submit">Save changes</Button>
            <SheetClose as-child>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>`,
  ),
};
