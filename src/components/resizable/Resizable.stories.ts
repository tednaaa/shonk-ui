import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '.';

const components = { ResizablePanelGroup, ResizablePanel, ResizableHandle };

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  args: { direction: 'horizontal' },
  render: render(
    components,
    `<div class="h-48 max-w-md">
      <ResizablePanelGroup v-bind="args" class="rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Vertical: Story = {
  render: render(
    components,
    `<div class="h-72 max-w-md">
      <ResizablePanelGroup direction="vertical" class="rounded-lg border">
        <ResizablePanel :default-size="35">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="65">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>`,
  ),
};

export const WithHandle: Story = {
  render: render(
    components,
    `<div class="h-48 max-w-md">
      <ResizablePanelGroup direction="horizontal" class="rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>`,
  ),
};

export const Nested: Story = {
  render: render(
    components,
    `<div class="h-72 max-w-md">
      <ResizablePanelGroup direction="horizontal" class="rounded-lg border">
        <ResizablePanel :default-size="40">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="60">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel :default-size="30">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Header</span>
              </div>
            </ResizablePanel>
            <ResizableHandle with-handle />
            <ResizablePanel :default-size="70">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Content</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>`,
  ),
};
