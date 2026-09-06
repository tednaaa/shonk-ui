import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, StoryLabel } from '@/lib/storybook';
import { SwipeAction } from '.';
import SwipeBothSides from './examples/SwipeBothSides.vue';
import swipeBothSidesSource from './examples/SwipeBothSides.vue?raw';
import SwipeDisabled from './examples/SwipeDisabled.vue';
import swipeDisabledSource from './examples/SwipeDisabled.vue?raw';
import SwipeThresholds from './examples/SwipeThresholds.vue';
import swipeThresholdsSource from './examples/SwipeThresholds.vue?raw';
import SwipeToArchive from './examples/SwipeToArchive.vue';
import swipeToArchiveSource from './examples/SwipeToArchive.vue?raw';
import SwipeToDelete from './examples/SwipeToDelete.vue';
import swipeToDeleteSource from './examples/SwipeToDelete.vue?raw';

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

export const Default: Story = {
  parameters: example(swipeToDeleteSource),
  render: render({ SwipeToDelete, StoryLabel }, `
    <div class="mx-auto max-w-sm space-y-2">
      <StoryLabel>Swipe left a little to reveal delete, or keep going to delete outright</StoryLabel>
      <SwipeToDelete />
    </div>
  `),
};

export const LeftAction: Story = {
  parameters: example(
    swipeToArchiveSource,
    'Filling only `left-action` puts the action on the left edge, revealed by swiping right. A swipe the other way does nothing.',
  ),
  render: render({ SwipeToArchive, StoryLabel }, `
    <div class="mx-auto max-w-sm space-y-2">
      <StoryLabel>Swipe right</StoryLabel>
      <SwipeToArchive />
    </div>
  `),
};

export const BothSides: Story = {
  parameters: example(
    swipeBothSidesSource,
    'With both slots filled the row drags either way, and `trigger` reports which side fired. Dragging past the middle hands the row over to the opposite action.',
  ),
  render: render({ SwipeBothSides, StoryLabel }, `
    <div class="mx-auto max-w-sm space-y-2">
      <StoryLabel>Swipe right to archive, left to delete</StoryLabel>
      <SwipeBothSides />
    </div>
  `),
};

export const Thresholds: Story = {
  parameters: example(
    swipeThresholdsSource,
    'Both thresholds are fractions, but of different widths. `triggerThreshold` is a fraction of the whole row and defaults to `0.6`: swipe the same distance down both lists and the eager one deletes where the deliberate one only snaps open. `openThreshold` is a fraction of the action button instead, defaulting to `0.5`, and decides how far you must drag before a released row stays open rather than springing shut.',
  ),
  render: render({ SwipeThresholds, StoryLabel }, `
    <div class="mx-auto max-w-sm space-y-2">
      <StoryLabel>The same swipe deletes in the first list and only opens in the second</StoryLabel>
      <SwipeThresholds />
    </div>
  `),
};

export const Disabled: Story = {
  parameters: example(swipeDisabledSource),
  render: render({ SwipeDisabled, StoryLabel }, `
    <div class="mx-auto max-w-sm space-y-2">
      <StoryLabel>Rows stay put and the action is not focusable</StoryLabel>
      <SwipeDisabled />
    </div>
  `),
};
