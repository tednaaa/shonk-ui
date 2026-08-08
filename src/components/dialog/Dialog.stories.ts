import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { VisuallyHidden } from 'reka-ui';
import { render, showControls } from '@/lib/storybook';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '.';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const components = {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  VisuallyHidden,
};

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this document</DialogTitle>
          <DialogDescription>
            Anyone with the link will be able to view this document.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter show-close-button />
      </DialogContent>
    </Dialog>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const TitleOnly: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Delete project</Button>
      </DialogTrigger>
      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose as-child>
            <Button>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>`,
  ),
};

export const WithBody: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Publish changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish changes</DialogTitle>
          <DialogDescription>
            Review what happens before you continue.
          </DialogDescription>
        </DialogHeader>
        <DialogBody class="text-text-secondary text-sm">
          Your changes will be applied immediately and a confirmation email will be sent to
          everyone with access to this workspace.
        </DialogBody>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>`,
  ),
};

export const WithoutFooter: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">What's new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What's new in v2</DialogTitle>
          <DialogDescription>
            A quick summary of the latest release.
          </DialogDescription>
        </DialogHeader>
        <DialogBody class="text-text-secondary text-sm">
          Faster builds, a redesigned dialog, and a brand new scrollable body. Close this
          dialog with the button in the header.
        </DialogBody>
      </DialogContent>
    </Dialog>`,
  ),
};

export const WithoutHeader: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Show notice</Button>
      </DialogTrigger>
      <DialogContent :aria-describedby="undefined">
        <VisuallyHidden>
          <DialogTitle>Notice</DialogTitle>
        </VisuallyHidden>
        <DialogBody class="text-text-secondary text-sm">
          This dialog has no visible header — just a body and a footer divider below it.
        </DialogBody>
        <DialogFooter show-close-button />
      </DialogContent>
    </Dialog>`,
  ),
};

export const NoCloseButton: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Confirm subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader :show-close-button="false">
          <DialogTitle>Confirm your subscription</DialogTitle>
          <DialogDescription>
            You can only dismiss this dialog using the buttons below.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Not now</Button>
          </DialogClose>
          <DialogClose as-child>
            <Button>Subscribe</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>`,
  ),
};

export const WithForm: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <form @submit.prevent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="name">Name</Label>
                <Input id="name" default-value="Pedro Duarte" />
              </div>
              <div class="grid gap-2">
                <Label for="username">Username</Label>
                <Input id="username" default-value="@peduarte" />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose as-child>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>`,
  ),
};

export const Scrollable: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Terms of service</Button>
      </DialogTrigger>
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>
            Please read the following terms carefully before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div class="space-y-4 text-text-secondary text-sm">
            <p v-for="n in 12" :key="n">
              Section {{ n }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </DialogBody>
        <DialogFooter show-close-button />
      </DialogScrollContent>
    </Dialog>`,
  ),
};

export const ScrollableWithoutFooter: Story = {
  render: render(
    components,
    `<Dialog v-bind="args">
      <DialogTrigger as-child>
        <Button variant="outline">Changelog</Button>
      </DialogTrigger>
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle>Changelog</DialogTitle>
          <DialogDescription>
            Everything that shipped in the last few releases.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div class="space-y-4 text-text-secondary text-sm">
            <p v-for="n in 12" :key="n">
              Release {{ n }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </DialogBody>
      </DialogScrollContent>
    </Dialog>`,
  ),
};
