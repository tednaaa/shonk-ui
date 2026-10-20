import type { VueWrapper } from '@vue/test-utils';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import {
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from '.';

const ITEM_HEIGHT = 100;
const VIEWPORT_HEIGHT = 300;

const scrollTops = new WeakMap<Element, number>();

function isViewport(element: Element) {
	return element.getAttribute('data-slot') === 'message-scroller-viewport';
}

function items(viewport: Element) {
	return Array.from(viewport.querySelectorAll('[data-slot="message-scroller-item"]'));
}

function contentHeight(viewport: Element) {
	return items(viewport).length * ITEM_HEIGHT;
}

function maxScroll(viewport: Element) {
	return Math.max(0, contentHeight(viewport) - VIEWPORT_HEIGHT);
}

function rect(top: number, height: number) {
	return { top, bottom: top + height, left: 0, right: 0, width: 0, height, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
}

function installLayout() {
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
		if (isViewport(this))
			return rect(0, VIEWPORT_HEIGHT);
		const viewport = this.closest('[data-slot="message-scroller-viewport"]');
		if (!viewport || this.getAttribute('data-slot') !== 'message-scroller-item')
			return rect(0, 0);
		const offset = items(viewport).indexOf(this) * ITEM_HEIGHT;
		return rect(offset - (scrollTops.get(viewport) ?? 0), ITEM_HEIGHT);
	});
	vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
		return isViewport(this) ? contentHeight(this) : 0;
	});
	vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
		return isViewport(this) ? VIEWPORT_HEIGHT : 0;
	});
	vi.spyOn(Element.prototype, 'scrollTop', 'get').mockImplementation(function (this: Element) {
		return scrollTops.get(this) ?? 0;
	});
	vi.spyOn(Element.prototype, 'scrollTop', 'set').mockImplementation(function (this: Element, value: number) {
		scrollTops.set(this, isViewport(this) ? Math.min(Math.max(value, 0), maxScroll(this)) : value);
	});
	Element.prototype.scrollTo = function (this: Element, options?: ScrollToOptions | number) {
		this.scrollTop = typeof options === 'number' ? options : (options?.top ?? 0);
		this.dispatchEvent(new Event('scroll'));
	} as Element['scrollTo'];
}

const Chat = defineComponent({
	props: { ids: { type: Array as () => string[], required: true } },
	setup(props) {
		return () => h(MessageScrollerProvider, { autoScroll: true }, () =>
			h(MessageScroller, null, () =>
				h(MessageScrollerViewport, null, () =>
					h(MessageScrollerContent, null, () =>
						props.ids.map(id => h(MessageScrollerItem, { key: id, messageId: id }, () => id))))));
	},
});

function range(from: number, to: number) {
	return Array.from({ length: to - from }, (_, index) => `m${from + index}`);
}

function viewportOf(wrapper: VueWrapper) {
	return wrapper.get('[data-slot="message-scroller-viewport"]').element;
}

async function scrollAsUser(wrapper: VueWrapper, top: number) {
	const viewport = wrapper.get('[data-slot="message-scroller-viewport"]');
	await viewport.trigger('wheel');
	viewport.element.scrollTop = top;
	await viewport.trigger('scroll');
}

describe('useMessageScroller', () => {
	beforeEach(() => {
		installLayout();
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(callback, 0, 0));
		vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
		vi.stubGlobal('ResizeObserver', class {
			observe() {}
			unobserve() {}
			disconnect() {}
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('should follow new messages while at the end', async () => {
		const wrapper = mount(Chat, { props: { ids: range(0, 5) }, attachTo: document.body });
		await flushPromises();
		expect(viewportOf(wrapper).scrollTop).toBe(200);

		await wrapper.setProps({ ids: range(0, 6) });

		await vi.waitFor(() => expect(viewportOf(wrapper).scrollTop).toBe(300));
	});

	it('should stay put on new messages once the user scrolled up', async () => {
		const wrapper = mount(Chat, { props: { ids: range(0, 5) }, attachTo: document.body });
		await flushPromises();
		await scrollAsUser(wrapper, 50);

		await wrapper.setProps({ ids: range(0, 6) });
		await flushPromises();
		await new Promise(resolve => setTimeout(resolve, 10));

		expect(viewportOf(wrapper).scrollTop).toBe(50);
	});

	it('should keep the visible message in place when history is prepended', async () => {
		const wrapper = mount(Chat, { props: { ids: range(5, 10) }, attachTo: document.body });
		await flushPromises();
		await scrollAsUser(wrapper, 150);

		await wrapper.setProps({ ids: range(3, 10) });

		await vi.waitFor(() => expect(viewportOf(wrapper).scrollTop).toBe(350));
	});
});
