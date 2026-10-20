import type { VueWrapper } from '@vue/test-utils';
import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { FileUpload, FileUploadDropzone } from '.';

function file(name: string, type: string, size = 10) {
	return new File(['x'.repeat(size)], name, { type });
}

async function mountUpload(props: Record<string, unknown> = {}) {
	const wrapper = mount(FileUpload, {
		props,
		slots: { default: () => h(FileUploadDropzone) },
	});
	await flushPromises();
	return wrapper;
}

async function drop(wrapper: VueWrapper, files: File[]) {
	const event = new Event('drop', { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'dataTransfer', {
		value: { files, items: files.map(({ type }) => ({ kind: 'file', type })), dropEffect: 'none' },
	});
	wrapper.get('[data-slot="file-upload-dropzone"]').element.dispatchEvent(event);
	await wrapper.vm.$nextTick();
}

async function pick(wrapper: VueWrapper, files: File[]) {
	const input = wrapper.get('input[type="file"]');
	Object.defineProperty(input.element, 'files', { value: files, configurable: true });
	await input.trigger('change');
}

function lastModel(wrapper: VueWrapper) {
	return wrapper.emitted<[File[]]>('update:modelValue')?.at(-1)?.[0];
}

describe('fileUpload', () => {
	it('should add dropped and picked files to the model', async () => {
		const dropped = file('dropped.png', 'image/png');
		const picked = file('picked.pdf', 'application/pdf');
		const wrapper = await mountUpload({
			'multiple': true,
			'onUpdate:modelValue': (files: File[]) => wrapper.setProps({ modelValue: files }),
		});

		await drop(wrapper, [dropped]);
		await pick(wrapper, [picked]);

		expect(lastModel(wrapper)).toEqual([dropped, picked]);
	});

	it('should reject wrong type, too large and over the limit with a reason', async () => {
		const text = file('notes.txt', 'text/plain');
		const large = file('large.png', 'image/png', 2000);
		const first = file('first.png', 'image/png');
		const second = file('second.PDF', 'application/pdf');
		const third = file('third.jpg', 'image/jpeg');
		const wrapper = await mountUpload({ multiple: true, accept: 'image/*,.pdf', maxSize: 1000, maxFiles: 2 });

		await drop(wrapper, [text, large, first, second, third]);

		expect(lastModel(wrapper)).toEqual([first, second]);
		expect(wrapper.emitted('reject')?.[0]?.[0]).toEqual([
			{ file: text, reason: 'type' },
			{ file: large, reason: 'size' },
			{ file: third, reason: 'count' },
		]);
	});

	it('should replace the file with the first one when multiple is off', async () => {
		const current = file('current.png', 'image/png');
		const first = file('first.png', 'image/png');
		const second = file('second.png', 'image/png');
		const wrapper = await mountUpload({ modelValue: [current] });

		await drop(wrapper, [first, second]);

		expect(lastModel(wrapper)).toEqual([first]);
		expect(wrapper.emitted('reject')?.[0]?.[0]).toEqual([{ file: second, reason: 'count' }]);
	});

	it('should ignore drops while disabled', async () => {
		const wrapper = await mountUpload({ disabled: true });

		await drop(wrapper, [file('photo.png', 'image/png')]);

		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
		expect(wrapper.emitted('reject')).toBeUndefined();
	});
});
