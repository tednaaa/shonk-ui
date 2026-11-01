import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '.';

const storageKey = 'comments-sheet-width';

async function mountSheet(props: Record<string, unknown> = {}) {
	mount(Sheet, {
		attachTo: document.body,
		props: { defaultOpen: true },
		slots: {
			default: () => h(SheetContent, props, () => [h(SheetTitle, () => 'Comments'), h(SheetDescription, () => 'Thread')]),
		},
	});
	await flushPromises();
}

function handle() {
	return new DOMWrapper(document.querySelector('[role="separator"]')!);
}

function closeButton() {
	return [...document.querySelectorAll('button')].find(button => button.textContent?.trim() === 'Close');
}

describe('sheetContent', () => {
	afterEach(() => {
		localStorage.clear();
		document.body.innerHTML = '';
	});

	it('should widen a right sheet with ArrowLeft up to the maximum', async () => {
		await mountSheet({ resizable: true, defaultWidth: 380, maxWidth: 400 });

		await handle().trigger('keydown', { key: 'ArrowLeft' });
		expect(handle().attributes('aria-valuenow')).toBe('396');

		await handle().trigger('keydown', { key: 'ArrowLeft' });
		expect(handle().attributes('aria-valuenow')).toBe('400');
	});

	it('should narrow a right sheet with ArrowRight down to the minimum', async () => {
		await mountSheet({ resizable: true, defaultWidth: 330, minWidth: 320 });

		await handle().trigger('keydown', { key: 'ArrowRight' });

		expect(handle().attributes('aria-valuenow')).toBe('320');
	});

	it('should widen a left sheet with ArrowRight', async () => {
		await mountSheet({ resizable: true, side: 'left', defaultWidth: 380 });

		await handle().trigger('keydown', { key: 'ArrowRight' });

		expect(handle().attributes('aria-valuenow')).toBe('396');
	});

	it('should restore the width stored under the key and store a change', async () => {
		localStorage.setItem(storageKey, '500');
		await mountSheet({ resizable: true, storageKey });

		expect(handle().attributes('aria-valuenow')).toBe('500');

		await handle().trigger('keydown', { key: 'ArrowLeft' });

		expect(localStorage.getItem(storageKey)).toBe('516');
	});

	it('should cap the width at the viewport', async () => {
		await mountSheet({ resizable: true, defaultWidth: window.innerWidth + 200 });

		expect(handle().attributes('aria-valuenow')).toBe(String(window.innerWidth));
	});

	it('should drop the close button when showCloseButton is false', async () => {
		await mountSheet({ showCloseButton: false });

		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		expect(closeButton()).toBeUndefined();
	});
});
