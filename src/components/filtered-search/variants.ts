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
			false: '-my-2 scrollbar-none overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden',
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

export const filterTokenVariants = cva('inline-flex h-6 shrink-0 items-stretch gap-px text-xs', {
	variants: {
		rounded: {
			both: '*:first:rounded-l-md *:last:rounded-r-md',
			start: '*:first:rounded-l-md',
			end: '*:last:rounded-r-md',
		},
	},
	defaultVariants: {
		rounded: 'both',
	},
});

export const filterTokenPartVariants = cva(
	'inline-flex min-w-0 items-center px-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset',
	{
		variants: {
			part: {
				handle: 'shrink-0 cursor-grab touch-none bg-secondary px-0.5 text-muted-foreground active:cursor-grabbing',
				key: 'shrink-0 bg-secondary font-medium text-secondary-foreground',
				operator: 'shrink-0 bg-secondary text-muted-foreground',
				value: 'gap-1 bg-input/70 text-secondary-foreground',
			},
			editable: {
				true: 'cursor-pointer',
				false: '',
			},
		},
		compoundVariants: [
			{ part: ['key', 'operator'], editable: true, class: 'hover:bg-secondary/70' },
			{ part: 'value', editable: true, class: 'hover:bg-input/50' },
		],
		defaultVariants: {
			editable: false,
		},
	},
);
