import type { MaybeRefOrGetter, Ref } from 'vue';
import type { ActiveFilter } from './types';
import { nextTick, ref, toValue } from 'vue';

const DRAG_THRESHOLD = 4;
const SWAP_OVERLAP = 0.3;
const ANIMATION: KeyframeAnimationOptions = { duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' };

function prefersReducedMotion() {
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function suppressNextClick() {
	const stop = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
	};
	window.addEventListener('click', stop, { capture: true, once: true });
	setTimeout(() => window.removeEventListener('click', stop, { capture: true }));
}

function tokenElements(list: HTMLElement) {
	return [...list.querySelectorAll<HTMLElement>('[data-filter-id]')];
}

function findToken(list: HTMLElement, id: string) {
	return tokenElements(list).find(token => token.dataset.filterId === id) ?? null;
}

type Layout = Map<string | undefined, DOMRect>;

interface DraggedBox {
	left: number;
	right: number;
	centerY: number | null;
}

function hasPassed(rect: DOMRect, box: DraggedBox, forward: boolean) {
	if (box.centerY !== null && (forward ? box.centerY > rect.bottom : box.centerY < rect.top))
		return true;
	const sameRow = box.centerY === null || (box.centerY >= rect.top && box.centerY <= rect.bottom);
	const reach = rect.width * SWAP_OVERLAP;
	return sameRow && (forward ? box.right > rect.left + reach : box.left < rect.right - reach);
}

function reorder(filters: ActiveFilter[], layout: Layout, draggedId: string, box: DraggedBox) {
	const from = filters.findIndex(filter => filter.id === draggedId);
	if (from === -1)
		return filters;
	const rest = filters.filter(filter => filter.id !== draggedId);
	const index = rest.filter((filter, i) => {
		const rect = layout.get(filter.id);
		if (!rect)
			return i < from;
		return i < from ? !hasPassed(rect, box, false) : hasPassed(rect, box, true);
	}).length;
	return [...rest.slice(0, index), filters[from], ...rest.slice(index)];
}

function snapshot(list: HTMLElement): Layout {
	return new Map(tokenElements(list).map(token => [token.dataset.filterId, token.getBoundingClientRect()]));
}

function settledLayout(list: HTMLElement, draggedId: string): Layout {
	for (const token of tokenElements(list)) {
		if (token.dataset.filterId !== draggedId)
			token.getAnimations?.().forEach(animation => animation.cancel());
	}
	return snapshot(list);
}

function slideFromSnapshot(list: HTMLElement, before: Layout, after: Layout, skipId: string) {
	for (const token of tokenElements(list)) {
		const previous = before.get(token.dataset.filterId);
		const current = after.get(token.dataset.filterId);
		if (!previous || !current || token.dataset.filterId === skipId)
			continue;
		const dx = previous.left - current.left;
		const dy = previous.top - current.top;
		if (dx || dy)
			token.animate?.([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], ANIMATION);
	}
}

export function useTokenDrag(options: {
	enabled: MaybeRefOrGetter<boolean>;
	vertical: MaybeRefOrGetter<boolean>;
	list: Ref<HTMLElement | null>;
	filters: Ref<ActiveFilter[]>;
}) {
	const draggingId = ref<string | null>(null);

	function startDrag(e: PointerEvent, id: string) {
		const list = options.list.value;
		const token = list && findToken(list, id);
		if (!list || !token || !toValue(options.enabled) || e.button !== 0)
			return;
		e.preventDefault();

		const { clientX: startX, clientY: startY } = e;
		const origin = token.getBoundingClientRect();
		const grabX = startX - origin.left;
		const grabY = startY - origin.top;
		let pointerX = startX;
		let pointerY = startY;
		const initialFilters = options.filters.value;
		const initialLayout = settledLayout(list, id);

		const follow = () => {
			const element = findToken(list, id);
			if (!element)
				return;
			element.style.translate = '';
			const rect = element.getBoundingClientRect();
			const dx = Math.round(pointerX - grabX - rect.left);
			const dy = toValue(options.vertical) ? Math.round(pointerY - grabY - rect.top) : 0;
			element.style.translate = `${dx}px ${dy}px`;
		};

		const move = (event: PointerEvent) => {
			pointerX = event.clientX;
			pointerY = event.clientY;
			if (!draggingId.value) {
				if (Math.hypot(pointerX - startX, pointerY - startY) < DRAG_THRESHOLD)
					return;
				draggingId.value = id;
			}
			const left = pointerX - grabX;
			const next = reorder(initialFilters, initialLayout, id, {
				left,
				right: left + origin.width,
				centerY: toValue(options.vertical) ? pointerY - grabY + origin.height / 2 : null,
			});
			if (next.every((filter, index) => filter === options.filters.value[index])) {
				follow();
				return;
			}
			const before = snapshot(list);
			options.filters.value = next;
			nextTick(() => {
				const after = settledLayout(list, id);
				if (!prefersReducedMotion())
					slideFromSnapshot(list, before, after, id);
				follow();
			});
		};

		const end = () => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', end);
			window.removeEventListener('pointercancel', end);
			if (!draggingId.value)
				return;
			suppressNextClick();
			draggingId.value = null;
			const element = findToken(list, id);
			if (!element)
				return;
			const lifted = element.style.translate;
			element.style.translate = '';
			if (lifted && !prefersReducedMotion())
				element.animate?.([{ translate: lifted }, { translate: '0px 0px' }], ANIMATION);
		};

		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', end);
		window.addEventListener('pointercancel', end);
	}

	return { draggingId, startDrag };
}
