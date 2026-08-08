import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { toast, Toaster } from '.';
import { Button } from '../button';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup() {
      function show() {
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        });
      }
      return { show };
    },
    template: `
      <Button variant="outline" @click="show">Show toast</Button>
      <Toaster />
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup() {
      return {
        success: () => toast.success('Changes saved successfully.'),
        error: () => toast.error('Something went wrong.'),
        warning: () => toast.warning('Your trial ends in 3 days.'),
        info: () => toast.info('A new version is available.'),
      };
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="success">Success</Button>
        <Button variant="outline" @click="error">Error</Button>
        <Button variant="outline" @click="warning">Warning</Button>
        <Button variant="outline" @click="info">Info</Button>
      </div>
      <Toaster />
    `,
  }),
};

export const WithAction: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup() {
      function show() {
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => toast('Event removed'),
          },
        });
      }
      return { show };
    },
    template: `
      <Button variant="outline" @click="show">Show toast with action</Button>
      <Toaster />
    `,
  }),
};

export const WithPromise: Story = {
  render: () => ({
    components: { Button, Toaster },
    setup() {
      function show() {
        const promise = new Promise(resolve => setTimeout(resolve, 2000));
        toast.promise(promise, {
          loading: 'Saving…',
          success: 'Settings saved',
          error: 'Could not save settings',
        });
      }
      return { show };
    },
    template: `
      <Button variant="outline" @click="show">Run promise</Button>
      <Toaster />
    `,
  }),
};
