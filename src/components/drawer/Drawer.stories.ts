import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '.';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const components = {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Button,
	Input,
	Label,
};

const meta: Meta<typeof Drawer> = {
	title: 'Overlays/Drawer',
	component: Drawer,
	tags: ['autodocs'],
	render: render(
		components,
		`<Drawer v-bind="args">
      <DrawerTrigger as-child>
        <Button variant="secondary">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose as-child>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Directions: Story = {
	render: render(
		components,
		`<div class="flex flex-wrap gap-2">
      <Drawer v-for="direction in ['up', 'right', 'down', 'left']" :key="direction" :swipe-direction="direction">
        <DrawerTrigger as-child>
          <Button variant="secondary" class="capitalize">{{ direction }}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle class="capitalize">Swipe {{ direction }}</DrawerTitle>
            <DrawerDescription>Swipe {{ direction }} to dismiss.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>`,
	),
};

export const WithForm: Story = {
	render: render(
		components,
		`<Drawer>
      <DrawerTrigger as-child>
        <Button variant="secondary">Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here.</DrawerDescription>
          </DrawerHeader>
          <form class="grid gap-4 px-4" @submit.prevent>
            <div class="grid gap-2">
              <Label for="drawer-name">Name</Label>
              <Input id="drawer-name" default-value="Pedro Duarte" />
            </div>
            <div class="grid gap-2">
              <Label for="drawer-username">Username</Label>
              <Input id="drawer-username" default-value="@peduarte" />
            </div>
          </form>
          <DrawerFooter>
            <Button>Save changes</Button>
            <DrawerClose as-child>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>`,
	),
};
