<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { useSwipe } from '@vueuse/core';
import { Primitive } from 'reka-ui';
import { computed, onMounted, ref, useSlots, useTemplateRef } from 'vue';
import { cn, hasSlotContent } from '@/utils';

export type SwipeActionSide = 'left' | 'right';

export interface SwipeActionProps extends PrimitiveProps {
  openThreshold?: number;
  triggerThreshold?: number;
  disabled?: boolean;
  leftActionAriaLabel?: string;
  rightActionAriaLabel?: string;
  class?: HTMLAttributes['class'];
  leftActionClass?: HTMLAttributes['class'];
  rightActionClass?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<SwipeActionProps>(), {
  as: 'div',
  openThreshold: 0.5,
  triggerThreshold: 0.6,
});

const emit = defineEmits<{ trigger: [side: SwipeActionSide] }>();

defineSlots<{
  'default'?: () => unknown;
  'left-action'?: () => unknown;
  'right-action'?: () => unknown;
}>();

const SWIPE_START = 24;

const panelClass = 'absolute inset-y-0 flex items-stretch bg-destructive text-white';
const actionButtonClass = 'flex shrink-0 items-center justify-center px-6 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-5';

const slots = useSlots();

const content = useTemplateRef<HTMLElement>('content');
const leftAction = useTemplateRef<HTMLElement>('leftAction');
const rightAction = useTemplateRef<HTMLElement>('rightAction');

const actionWidth = ref<Record<SwipeActionSide, number>>({ left: 0, right: 0 });
const rowWidth = ref(0);
const shift = ref(0);

let shiftAtStart = 0;
let swipingSideways: boolean | undefined;

const hasAction = computed<Record<SwipeActionSide, boolean>>(() => ({
  left: hasSlotContent(slots['left-action']),
  right: hasSlotContent(slots['right-action']),
}));

const openSide = computed<SwipeActionSide | undefined>(() => {
  if (shift.value > 0)
    return 'left';

  if (shift.value < 0)
    return 'right';

  return undefined;
});

function revealedOn(side: SwipeActionSide, offset: number) {
  return Math.max(0, side === 'left' ? offset : -offset);
}

function travelTowards(side: SwipeActionSide) {
  return actionWidth.value[side] > 0 ? rowWidth.value : 0;
}

function measure() {
  actionWidth.value = {
    left: leftAction.value?.offsetWidth ?? 0,
    right: rightAction.value?.offsetWidth ?? 0,
  };

  rowWidth.value = content.value?.offsetWidth ?? 0;
}

function openAction(side: SwipeActionSide) {
  measure();
  shift.value = side === 'left' ? actionWidth.value.left : -actionWidth.value.right;
}

function closeAction() {
  shift.value = 0;
}

function triggerAction(side: SwipeActionSide) {
  closeAction();
  emit('trigger', side);
}

function withoutDeadZone(travelled: number) {
  if (travelled > SWIPE_START)
    return travelled - SWIPE_START;

  if (travelled < -SWIPE_START)
    return travelled + SWIPE_START;

  return 0;
}

const { lengthX, direction, isSwiping } = useSwipe(content, {
  threshold: SWIPE_START,
  passive: false,
  onSwipeStart() {
    swipingSideways = undefined;
    shiftAtStart = shift.value;
    measure();
  },
  onSwipe() {
    swipingSideways ??= direction.value === 'left' || direction.value === 'right';

    if (!swipingSideways || props.disabled)
      return;

    const travelled = shiftAtStart - withoutDeadZone(lengthX.value);

    shift.value = Math.min(travelTowards('left'), Math.max(-travelTowards('right'), travelled));
  },
  onSwipeEnd() {
    const side = openSide.value;

    if (!side) {
      closeAction();
      return;
    }

    const revealed = revealedOn(side, shift.value);
    const advancing = revealed > revealedOn(side, shiftAtStart);

    if (rowWidth.value > 0 && revealed >= rowWidth.value * props.triggerThreshold)
      triggerAction(side);
    else if (advancing && revealed >= actionWidth.value[side] * props.openThreshold)
      openAction(side);
    else
      closeAction();
  },
});

const isOpen = computed(() => !isSwiping.value && shift.value !== 0);

onMounted(measure);
</script>

<template>
  <Primitive
    data-slot="swipe-action"
    :as="as"
    :as-child="asChild"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <div
      v-if="hasAction.left"
      data-slot="swipe-action-panel"
      data-side="left"
      :class="cn(panelClass, 'left-0 justify-end', leftActionClass)"
      :style="{ width: `${revealedOn('left', shift)}px` }"
    >
      <button
        ref="leftAction"
        type="button"
        :disabled="disabled"
        :aria-label="leftActionAriaLabel"
        :class="actionButtonClass"
        @click="triggerAction('left')"
        @focus="openAction('left')"
        @blur="closeAction"
      >
        <slot name="left-action" />
      </button>
    </div>

    <div
      v-if="hasAction.right"
      data-slot="swipe-action-panel"
      data-side="right"
      :class="cn(panelClass, 'right-0 justify-start', rightActionClass)"
      :style="{ width: `${revealedOn('right', shift)}px` }"
    >
      <button
        ref="rightAction"
        type="button"
        :disabled="disabled"
        :aria-label="rightActionAriaLabel"
        :class="actionButtonClass"
        @click="triggerAction('right')"
        @focus="openAction('right')"
        @blur="closeAction"
      >
        <slot name="right-action" />
      </button>
    </div>

    <div
      ref="content"
      data-slot="swipe-action-content"
      :class="cn('relative touch-pan-y bg-background', !isSwiping && 'transition-transform')"
      :style="{ transform: `translateX(${shift}px)` }"
    >
      <slot />

      <div
        data-slot="swipe-action-dismiss"
        :class="cn('absolute inset-0', !isOpen && 'pointer-events-none')"
        @click="closeAction"
      />
    </div>
  </Primitive>
</template>
