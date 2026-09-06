import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { SwipeActionSide } from '.';
import { ArchiveIcon, Trash2Icon } from '@lucide/vue';
import { ref } from 'vue';
import { StoryLabel } from '@/lib/storybook';
import { SwipeAction } from '.';

const meta: Meta<typeof SwipeAction> = {
  title: 'Mobile/SwipeAction',
  component: SwipeAction,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A row whose sideways swipe reveals an action. Fill the `left-action` slot, the `right-action` slot, or both — the row only travels towards a side that has one. A short swipe past `openThreshold` snaps the row open so the action can be confirmed with a tap; dragging on past `triggerThreshold` sweeps the row away and emits `trigger` with the side that fired. Gestures are touch-only, so enable device emulation to try them with a mouse. Each action is a real button that opens the row on focus, which keeps it reachable without a touchscreen.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function todoList() {
  const items = ref(['Buy milk', 'Call the dentist', 'Renew passport']);

  return { items, remove: (index: number) => items.value.splice(index, 1) };
}

const listClass = 'overflow-hidden rounded-md border border-border';
const rowClass = 'border-b border-border last:border-b-0';

export const Default: Story = {
  render: () => ({
    components: { SwipeAction, Trash2Icon, StoryLabel },
    setup: todoList,
    template: `
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>Swipe left a little to reveal delete, or keep going to delete outright</StoryLabel>
        <ul class="${listClass}">
          <SwipeAction
            v-for="(item, index) in items"
            :key="item"
            as="li"
            right-action-aria-label="Delete"
            class="${rowClass}"
            @trigger="remove(index)"
          >
            <template #right-action><Trash2Icon /></template>
            <p class="px-4 py-3 text-sm">{{ item }}</p>
          </SwipeAction>
        </ul>
        <p v-if="!items.length" class="text-sm text-muted-foreground">Nothing left.</p>
      </div>
    `,
  }),
};

export const LeftAction: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Filling only `left-action` puts the action on the left edge, revealed by swiping right. A swipe the other way does nothing.',
      },
    },
  },
  render: () => ({
    components: { SwipeAction, ArchiveIcon, StoryLabel },
    setup: todoList,
    template: `
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>Swipe right</StoryLabel>
        <ul class="${listClass}">
          <SwipeAction
            v-for="(item, index) in items"
            :key="item"
            as="li"
            left-action-aria-label="Archive"
            left-action-class="bg-secondary text-secondary-foreground"
            class="${rowClass}"
            @trigger="remove(index)"
          >
            <template #left-action><ArchiveIcon /></template>
            <p class="px-4 py-3 text-sm">{{ item }}</p>
          </SwipeAction>
        </ul>
      </div>
    `,
  }),
};

export const BothSides: Story = {
  parameters: {
    docs: {
      description: {
        story: 'With both slots filled the row drags either way, and `trigger` reports which side fired. Dragging past the middle hands the row over to the opposite action.',
      },
    },
  },
  render: () => ({
    components: { SwipeAction, ArchiveIcon, Trash2Icon, StoryLabel },
    setup() {
      const items = ref(['Buy milk', 'Call the dentist', 'Renew passport']);
      const last = ref('Swipe right to archive, left to delete');

      function act(side: SwipeActionSide, index: number) {
        last.value = `${side === 'left' ? 'Archived' : 'Deleted'} ${items.value[index]}`;
        items.value.splice(index, 1);
      }

      return { items, last, act };
    },
    template: `
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>{{ last }}</StoryLabel>
        <ul class="${listClass}">
          <SwipeAction
            v-for="(item, index) in items"
            :key="item"
            as="li"
            left-action-aria-label="Archive"
            left-action-class="bg-secondary text-secondary-foreground"
            right-action-aria-label="Delete"
            class="${rowClass}"
            @trigger="side => act(side, index)"
          >
            <template #left-action><ArchiveIcon /></template>
            <template #right-action><Trash2Icon /></template>
            <p class="px-4 py-3 text-sm">{{ item }}</p>
          </SwipeAction>
        </ul>
      </div>
    `,
  }),
};

export const Thresholds: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Both thresholds are fractions, but of different widths. `triggerThreshold` is a fraction of the whole row and defaults to `0.6`: swipe the same distance down both lists and the eager one deletes where the deliberate one only snaps open. `openThreshold` is a fraction of the action button instead, defaulting to `0.5`, and decides how far you must drag before a released row stays open rather than springing shut.',
      },
    },
  },
  render: () => ({
    components: { SwipeAction, Trash2Icon, StoryLabel },
    setup() {
      const lists = ref([
        { title: 'Eager — deletes once a third of the row is gone', triggerThreshold: 0.3, items: ['Buy milk', 'Call the dentist', 'Renew passport'] },
        { title: 'Deliberate — holds out until the row is nearly away', triggerThreshold: 0.9, items: ['Buy milk', 'Call the dentist', 'Renew passport'] },
      ]);

      return { lists };
    },
    template: `
      <div class="mx-auto max-w-sm space-y-6">
        <div v-for="list in lists" :key="list.title" class="space-y-2">
          <StoryLabel>{{ list.title }}</StoryLabel>
          <ul class="${listClass}">
            <SwipeAction
              v-for="(item, index) in list.items"
              :key="item"
              as="li"
              :trigger-threshold="list.triggerThreshold"
              right-action-aria-label="Delete"
              class="${rowClass}"
              @trigger="list.items.splice(index, 1)"
            >
              <template #right-action><Trash2Icon /></template>
              <p class="px-4 py-3 text-sm">{{ item }}</p>
            </SwipeAction>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { SwipeAction, Trash2Icon, StoryLabel },
    setup: todoList,
    template: `
      <div class="mx-auto max-w-sm space-y-2">
        <StoryLabel>Rows stay put and the action is not focusable</StoryLabel>
        <ul class="${listClass}">
          <SwipeAction
            v-for="(item, index) in items"
            :key="item"
            as="li"
            disabled
            right-action-aria-label="Delete"
            class="${rowClass}"
            @trigger="remove(index)"
          >
            <template #right-action><Trash2Icon /></template>
            <p class="px-4 py-3 text-sm">{{ item }}</p>
          </SwipeAction>
        </ul>
      </div>
    `,
  }),
};
