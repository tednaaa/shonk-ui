import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { CodeBlockCopyButton, useHighlightedCode } from '.';

class FakeClipboardItem {
	constructor(readonly items: Record<string, string>) {}
}

describe('codeBlock', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should copy the code from the copy button', async () => {
		const write = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('ClipboardItem', FakeClipboardItem);
		Object.defineProperty(window.navigator, 'clipboard', { value: { write }, configurable: true });
		Object.defineProperty(window.navigator, 'permissions', {
			value: { query: async () => ({ state: 'granted', addEventListener() {}, removeEventListener() {} }) },
			configurable: true,
		});
		const wrapper = mount(CodeBlockCopyButton, { props: { value: 'pnpm add shonk-ui' } });
		await flushPromises();

		await wrapper.get('button').trigger('click');
		await flushPromises();

		expect(write).toHaveBeenCalledWith([new FakeClipboardItem({ 'text/plain': 'pnpm add shonk-ui' })]);
		expect(wrapper.get('button').attributes('aria-label')).toBe('Copied');
	});

	it('should render an unknown language as plain lines', async () => {
		let lines: ReturnType<typeof useHighlightedCode> | undefined;
		mount(defineComponent({
			setup() {
				lines = useHighlightedCode('const answer = 42\n\nexport default answer\n', 'klingon');
				return () => null;
			},
		}));
		await flushPromises();

		expect(lines?.value).toEqual([
			[{ content: 'const answer = 42' }],
			[],
			[{ content: 'export default answer' }],
		]);
	});
});
