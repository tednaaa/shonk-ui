import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { ConfirmDialog, useConfirm } from '.';
import { Button } from '../button';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  render: () => ({
    components: { ConfirmDialog, Button },
    setup() {
      const { require } = useConfirm();
      const result = ref('');

      function confirm() {
        require({
          message: 'Are you sure you want to delete this item? This action cannot be undone.',
          acceptLabel: 'Delete',
          accept: () => (result.value = 'Accepted'),
          reject: () => (result.value = 'Rejected'),
        });
      }

      return { confirm, result };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <Button variant="outline" @click="confirm">Delete item</Button>
        <p v-if="result" class="text-text-tertiary text-sm">Result: {{ result }}</p>
        <ConfirmDialog />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
