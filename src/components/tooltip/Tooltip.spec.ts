import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { Tooltip } from '.';

async function mountTooltip(props: Record<string, unknown>, slots: Record<string, () => unknown> = {}) {
	const wrapper = mount(Tooltip, {
		attachTo: document.body,
		props: { defaultOpen: true, ...props },
		slots: { default: () => h('button', 'Save'), ...slots },
	});
	await flushPromises();
	return wrapper;
}

function shownContent() {
	return document.querySelector('[data-slot="tooltip-content"]');
}

describe('tooltip', () => {
	beforeEach(() => {
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

	it('should wrap the slotted trigger and show the content without a provider', async () => {
		const wrapper = await mountTooltip({ content: 'Add to library' });

		expect(wrapper.get('button').attributes('aria-describedby')).toBeDefined();
		expect(shownContent()?.textContent).toContain('Add to library');
	});

	it('should show rich content from the content slot', async () => {
		await mountTooltip({}, { content: () => h('kbd', 'Ctrl+S') });

		expect(shownContent()?.querySelector('kbd')?.textContent).toBe('Ctrl+S');
	});
});
