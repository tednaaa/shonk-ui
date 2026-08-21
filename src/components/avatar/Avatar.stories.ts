import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Avatar, AvatarFallback, AvatarImage } from '.';

const components = { Avatar, AvatarFallback, AvatarImage };

const avatarSrc = `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Crect%20width='64'%20height='64'%20fill='%23d4d4d8'/%3E%3Ccircle%20cx='32'%20cy='25'%20r='11'%20fill='%23fafafa'/%3E%3Ccircle%20cx='32'%20cy='60'%20r='18'%20fill='%23fafafa'/%3E%3C/svg%3E`;

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
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
