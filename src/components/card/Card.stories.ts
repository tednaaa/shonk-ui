import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { EllipsisIcon } from '@lucide/vue';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '.';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  render: render(
    { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, StoryLabel },
    `<div class="w-96 space-y-2">
      <StoryLabel>Header, content and footer composed together</StoryLabel>
      <Card v-bind="args">
        <CardHeader>
          <CardTitle>Project overview</CardTitle>
          <CardDescription>Everything your team ships, in one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-text-secondary text-sm">
            Deploy your new project in one click. Manage components, tokens and themes from a single place.
          </p>
        </CardContent>
        <CardFooter class="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithAction: Story = {
  render: render(
    { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, Button, EllipsisIcon, StoryLabel },
    `<div class="w-96 space-y-2">
      <StoryLabel>CardAction pins a control to the header's top-right</StoryLabel>
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Invite your team to collaborate.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon"><EllipsisIcon /></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p class="text-text-secondary text-sm">3 members have access to this project.</p>
        </CardContent>
      </Card>
    </div>`,
  ),
};

export const Login: Story = {
  render: render(
    { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, Button, Input, Label, StoryLabel },
    `<div class="w-96 space-y-2">
      <StoryLabel>Realistic form composed inside a card</StoryLabel>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
          <CardAction>
            <Button variant="link">Sign up</Button>
          </CardAction>
        </CardHeader>
        <CardContent class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter class="flex-col gap-2">
          <Button class="w-full">Login</Button>
          <Button variant="outline" class="w-full">Login with Google</Button>
        </CardFooter>
      </Card>
    </div>`,
  ),
};
