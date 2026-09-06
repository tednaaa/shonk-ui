import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SwipeAction from './SwipeAction.vue';

const ACTION_WIDTH = 96;
const ROW_WIDTH = 320;

const rightOnly = { 'default': '<p>row</p>', 'right-action': '<span>delete</span>' };
const leftOnly = { 'default': '<p>row</p>', 'left-action': '<span>archive</span>' };
const bothSides = { ...leftOnly, ...rightOnly };

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset.slot === 'swipe-action-content' ? ROW_WIDTH : ACTION_WIDTH;
    },
  });
});

async function mountRow(props: Record<string, unknown> = {}, slots: Record<string, string> = rightOnly) {
  const wrapper = mount(SwipeAction, { props, slots });

  await nextTick();

  return {
    wrapper,
    content: wrapper.get('[data-slot=swipe-action-content]').element,
    overlay: wrapper.get('[data-slot=swipe-action-dismiss]'),
    action: (side: string) => wrapper.get(`[data-side=${side}] button`),
    panels: () => wrapper.findAll('[data-slot=swipe-action-panel]').map(panel => panel.attributes('data-side')),
    panelWidth: (side: string) => wrapper.get<HTMLElement>(`[data-side=${side}]`).element.style.width,
    triggers: () => wrapper.emitted('trigger') ?? [],
    shift: () => wrapper.get<HTMLElement>('[data-slot=swipe-action-content]').element.style.transform,
  };
}

function touch(element: Element, type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'touches', { value: type === 'touchend' ? [] : [{ clientX: x, clientY: y }] });
  element.dispatchEvent(event);

  return event;
}

async function swipe(element: Element, path: Array<[number, number]>) {
  const [[startX, startY], ...moves] = path;
  const movements = [];

  touch(element, 'touchstart', startX, startY);
  await nextTick();

  for (const [x, y] of moves) {
    movements.push(touch(element, 'touchmove', x, y));
    await nextTick();
  }

  touch(element, 'touchend', 0, 0);
  await nextTick();

  return movements;
}

async function openRow(props: Record<string, unknown> = {}) {
  const row = await mountRow(props);

  await swipe(row.content, [[300, 50], [200, 50]]);

  return row;
}

describe('swipeAction', () => {
  describe('partial swipe', () => {
    it('snaps open and waits instead of firing', async () => {
      const { triggers, shift } = await openRow();

      expect(triggers()).toEqual([]);
      expect(shift()).toBe(`translateX(-${ACTION_WIDTH}px)`);
    });

    it('fires when the revealed button is then clicked', async () => {
      const { action, triggers, shift } = await openRow();

      await action('right').trigger('click');

      expect(triggers()).toEqual([['right']]);
      expect(shift()).toBe('translateX(0px)');
    });

    it('closes on a tap over the content', async () => {
      const { overlay, shift } = await openRow();

      await overlay.trigger('click');

      expect(shift()).toBe('translateX(0px)');
    });

    it('springs back below the open threshold', async () => {
      const { content, triggers, shift } = await mountRow();

      await swipe(content, [[300, 50], [270, 50]]);

      expect(triggers()).toEqual([]);
      expect(shift()).toBe('translateX(0px)');
    });
  });

  describe('from the open state', () => {
    it('keeps the dismiss overlay mounted through a gesture', async () => {
      const { wrapper, overlay } = await openRow();

      touch(overlay.element, 'touchstart', 300, 50);
      await nextTick();
      touch(overlay.element, 'touchmove', 200, 50);
      await nextTick();

      expect(wrapper.find('[data-slot=swipe-action-dismiss]').exists()).toBe(true);
    });

    it('carries on into a trigger when swiped further', async () => {
      const { overlay, triggers } = await openRow();

      await swipe(overlay.element, [[300, 50], [200, 50], [100, 50]]);

      expect(triggers()).toEqual([['right']]);
    });

    it('cancels on a short swipe back rather than snapping open', async () => {
      const { content, triggers, shift } = await openRow();

      await swipe(content, [[200, 50], [250, 50]]);

      expect(triggers()).toEqual([]);
      expect(shift()).toBe('translateX(0px)');
    });

    it('cancels on a long swipe back', async () => {
      const { content, shift } = await openRow();

      await swipe(content, [[200, 50], [300, 50]]);

      expect(shift()).toBe('translateX(0px)');
    });
  });

  describe('full swipe', () => {
    it('fires without waiting for a tap', async () => {
      const { content, triggers, shift } = await mountRow();

      await swipe(content, [[300, 50], [150, 50], [60, 50]]);

      expect(triggers()).toEqual([['right']]);
      expect(shift()).toBe('translateX(0px)');
    });

    it('grows the panel to cover the overshoot', async () => {
      const { content, panelWidth } = await mountRow();

      touch(content, 'touchstart', 300, 50);
      touch(content, 'touchmove', 150, 50);
      await nextTick();

      expect(panelWidth('right')).toBe('126px');
    });

    it('travels the full row width and no further', async () => {
      const { content, panelWidth, shift } = await mountRow();

      touch(content, 'touchstart', 900, 50);
      touch(content, 'touchmove', 0, 50);
      await nextTick();

      expect(shift()).toBe(`translateX(-${ROW_WIDTH}px)`);
      expect(panelWidth('right')).toBe(`${ROW_WIDTH}px`);
    });
  });

  describe('one-sided rows', () => {
    it('renders only the panel it has an action for', async () => {
      const { panels } = await mountRow();

      expect(panels()).toEqual(['right']);
    });

    it('opens the left action on a swipe right', async () => {
      const { content, shift } = await mountRow({}, leftOnly);

      await swipe(content, [[200, 50], [300, 50]]);

      expect(shift()).toBe(`translateX(${ACTION_WIDTH}px)`);
    });

    it('ignores a swipe away from its only action', async () => {
      const { content, triggers, shift } = await mountRow();

      await swipe(content, [[100, 50], [200, 50], [300, 50]]);

      expect(triggers()).toEqual([]);
      expect(shift()).toBe('translateX(0px)');
    });
  });

  describe('two-sided rows', () => {
    it('renders a panel on each side, both flat until swiped', async () => {
      const { panels, panelWidth } = await mountRow({}, bothSides);

      expect(panels()).toEqual(['left', 'right']);
      expect(panelWidth('left')).toBe('0px');
      expect(panelWidth('right')).toBe('0px');
    });

    it('keeps the opposite panel flat while one side is revealed', async () => {
      const { content, panelWidth } = await mountRow({}, bothSides);

      touch(content, 'touchstart', 0, 50);
      touch(content, 'touchmove', 900, 50);
      await nextTick();

      expect(panelWidth('left')).toBe(`${ROW_WIDTH}px`);
      expect(panelWidth('right')).toBe('0px');
    });

    it('opens whichever action the swipe heads for', async () => {
      const leftward = await mountRow({}, bothSides);
      const rightward = await mountRow({}, bothSides);

      await swipe(leftward.content, [[300, 50], [200, 50]]);
      await swipe(rightward.content, [[200, 50], [300, 50]]);

      expect(leftward.shift()).toBe(`translateX(-${ACTION_WIDTH}px)`);
      expect(rightward.shift()).toBe(`translateX(${ACTION_WIDTH}px)`);
    });

    it('names the side that a full swipe fired', async () => {
      const leftward = await mountRow({}, bothSides);
      const rightward = await mountRow({}, bothSides);

      await swipe(leftward.content, [[300, 50], [150, 50], [60, 50]]);
      await swipe(rightward.content, [[60, 50], [150, 50], [300, 50]]);

      expect(leftward.triggers()).toEqual([['right']]);
      expect(rightward.triggers()).toEqual([['left']]);
    });

    it('swings across to the other action when swiped past the middle', async () => {
      const { content, shift } = await mountRow({}, bothSides);

      await swipe(content, [[200, 50], [300, 50]]);
      expect(shift()).toBe(`translateX(${ACTION_WIDTH}px)`);

      await swipe(content, [[300, 50], [100, 50]]);
      expect(shift()).toBe(`translateX(-${ACTION_WIDTH}px)`);
    });
  });

  describe('gesture handling', () => {
    it('ignores vertical swipes', async () => {
      const { content, triggers, shift } = await mountRow();

      await swipe(content, [[200, 50], [200, 150], [200, 250]]);

      expect(triggers()).toEqual([]);
      expect(shift()).toBe('translateX(0px)');
    });

    it('preventDefaults sideways moves so no synthetic click follows', async () => {
      const { content } = await mountRow();

      const movements = await swipe(content, [[300, 50], [200, 50], [100, 50]]);

      expect(movements.every(movement => movement.defaultPrevented)).toBe(true);
    });

    it('leaves vertical moves alone so the page still scrolls', async () => {
      const { content } = await mountRow();

      const movements = await swipe(content, [[200, 50], [200, 150], [200, 250]]);

      expect(movements.some(movement => movement.defaultPrevented)).toBe(false);
    });

    it('does nothing while disabled', async () => {
      const { content, triggers, shift } = await mountRow({ disabled: true });

      await swipe(content, [[300, 50], [150, 50], [60, 50]]);

      expect(triggers()).toEqual([]);
      expect(shift()).toBe('translateX(0px)');
    });
  });

  describe('keyboard', () => {
    it('opens the row towards whichever action holds focus', async () => {
      const { action, shift } = await mountRow({}, bothSides);

      await action('left').trigger('focus');
      expect(shift()).toBe(`translateX(${ACTION_WIDTH}px)`);

      await action('left').trigger('blur');
      expect(shift()).toBe('translateX(0px)');

      await action('right').trigger('focus');
      expect(shift()).toBe(`translateX(-${ACTION_WIDTH}px)`);
    });
  });
});
