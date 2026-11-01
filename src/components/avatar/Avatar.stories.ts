import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '.';

const components = { Avatar, AvatarFallback, AvatarGroup, AvatarImage };

const names = ['alex doe', 'monster', 'satoshi_nakamoto', 'kate', 'vitalik'];

const photos = ['shadcn', 'yyx990803', 'antfu', 'leerob', 'evilrabbit'].map(user => ({ user, href: `https://github.com/${user}`, src: `https://github.com/${user}.png` }));

const avatarSrc = `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Crect%20width='64'%20height='64'%20fill='%23d4d4d8'/%3E%3Ccircle%20cx='32'%20cy='25'%20r='11'%20fill='%23fafafa'/%3E%3Ccircle%20cx='32'%20cy='60'%20r='18'%20fill='%23fafafa'/%3E%3C/svg%3E`;

const meta: Meta<typeof Avatar> = {
	title: 'Data/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	render: render(
		components,
		`<Avatar v-bind="args">
      <AvatarImage src="${avatarSrc}" alt="User avatar" />
      <AvatarFallback>AD</AvatarFallback>
    </Avatar>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Fallback: Story = {
	render: render(
		components,
		`<Avatar v-bind="args">
      <AvatarImage src="" alt="User avatar" />
      <AvatarFallback>AD</AvatarFallback>
    </Avatar>`,
	),
};

export const Initials: Story = {
	render: () => ({
		components,
		setup: () => ({ names }),
		template: `
      <div class="flex items-center gap-3">
        <Avatar v-for="name in names" :key="name">
          <AvatarFallback :name="name" />
        </Avatar>
        <Avatar class="size-5">
          <AvatarFallback name="alex doe" />
        </Avatar>
      </div>
    `,
	}),
};

export const Group: Story = {
	render: () => ({
		components,
		setup: () => ({ names }),
		template: `
      <AvatarGroup>
        <Avatar v-for="name in names" :key="name">
          <AvatarFallback :name="name" />
        </Avatar>
      </AvatarGroup>
    `,
	}),
};

export const GroupWithPhotos: Story = {
	render: () => ({
		components,
		setup: () => ({ photos }),
		template: `
      <AvatarGroup interactive class="pt-3">
        <a
          v-for="photo in photos"
          :key="photo.user"
          :href="photo.href"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full"
        >
          <Avatar class="size-10">
            <AvatarImage :src="photo.src" :alt="photo.user" />
            <AvatarFallback :name="photo.user" />
          </Avatar>
        </a>
      </AvatarGroup>
    `,
	}),
};
