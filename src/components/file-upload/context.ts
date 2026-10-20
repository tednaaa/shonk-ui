import type { InjectionKey, Ref } from 'vue';
import { inject } from 'vue';

export interface FileUploadContext {
	disabled: Readonly<Ref<boolean>>;
	open: () => void;
	addFiles: (files: File[]) => void;
}

export const fileUploadKey: InjectionKey<FileUploadContext> = Symbol('fileUpload');

export function useFileUploadContext() {
	const context = inject(fileUploadKey);
	if (!context)
		throw new Error('FileUploadDropzone and FileUploadTrigger must be used inside FileUpload');
	return context;
}
