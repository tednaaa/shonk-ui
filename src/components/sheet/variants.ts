import { cva } from 'class-variance-authority';

export const sheetContentVariants = cva(
	'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
				right: 'inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
				bottom: 'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
				left: 'inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
			},
			resizable: {
				true: 'w-(--sheet-width) max-w-full',
				false: '',
			},
		},
		compoundVariants: [
			{ side: ['left', 'right'], resizable: false, class: 'w-3/4 sm:max-w-sm' },
		],
		defaultVariants: {
			side: 'right',
			resizable: false,
		},
	},
);

export const sheetResizeHandleVariants = cva(
	'absolute inset-y-0 z-10 w-3 cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:transition-colors hover:after:bg-ring focus-visible:after:bg-ring',
	{
		variants: {
			side: {
				left: 'right-0 translate-x-1/2',
				right: 'left-0 -translate-x-1/2',
			},
		},
	},
);
