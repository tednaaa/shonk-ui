import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '.';

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

function closeButton() {
	return [...document.querySelectorAll('button')].find(button => button.textContent?.trim() === 'Close');
}

describe('sheetContent', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('should drop the close button when showCloseButton is false', async () => {
		await mountSheet({ showCloseButton: false });

		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		expect(closeButton()).toBeUndefined();
	});
});
