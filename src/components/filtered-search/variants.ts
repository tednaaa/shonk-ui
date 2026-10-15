import { cva } from 'class-variance-authority';

export const filteredSearchVariants = cva(
	'flex w-full items-center gap-1.5 overflow-hidden rounded-md border border-border bg-field px-3 text-sm text-field-foreground shadow-xs transition-[color,box-shadow] outline-none',
	{
		variants: {
			wrap: {
				true: 'min-h-10 py-1',
				false: 'h-10',
			},
			viewOnly: {
				true: 'text-muted-foreground',
				false: 'cursor-text',
			},
		},
		defaultVariants: {
			wrap: false,
			viewOnly: false,
		},
	},
);

export const filteredSearchTokenListVariants = cva('flex min-w-0 flex-1 items-center gap-1.5', {
	variants: {
		wrap: {
			true: 'flex-wrap',
			false: 'scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden',
		},
	},
	defaultVariants: {
		wrap: false,
	},
});

export const searchTokenVariants = cva(
	'inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-border bg-secondary pl-1.5 text-xs text-secondary-foreground',
	{
		variants: {
			removable: {
				true: 'pr-1',
				false: 'pr-1.5',
			},
		},
		defaultVariants: {
			removable: true,
		},
	},
);

export const filterTokenVariants = cva(
	'inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-border bg-secondary pl-2 text-xs text-secondary-foreground',
	{
		variants: {
			removable: {
				true: 'pr-1',
				false: 'pr-2',
			},
		},
		defaultVariants: {
			removable: true,
		},
	},
);
