import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '.';
import { Kbd, KbdGroup } from '../kbd';

const components = {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
	Kbd,
	KbdGroup,
};

const meta: Meta<typeof Menubar> = {
	title: 'Overlays/Menubar',
	component: Menubar,
	tags: ['autodocs'],
	render: render(
		components,
		`<Menubar v-bind="args">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem disabled>New incognito window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print… <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always show bookmarks bar</MenubarCheckboxItem>
          <MenubarCheckboxItem :model-value="true">Always show full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem inset>Toggle fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel inset>Switch profile</MenubarLabel>
          <MenubarRadioGroup model-value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive" inset>Remove profile</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const WithKbd: Story = {
	render: render(
		components,
		`<Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Save
            <KbdGroup class="ml-auto"><Kbd>Ctrl</Kbd><Kbd>S</Kbd></KbdGroup>
          </MenubarItem>
          <MenubarItem>
            Save as…
            <KbdGroup class="ml-auto"><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>S</Kbd></KbdGroup>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Close
            <KbdGroup class="ml-auto"><Kbd>Ctrl</Kbd><Kbd>W</Kbd></KbdGroup>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>`,
	),
};
