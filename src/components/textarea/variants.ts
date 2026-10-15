import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
	'flex w-full rounded-md border border-border bg-field px-3 py-2 text-base text-field-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive-ring md:text-sm',
	{
		variants: {
			autoResize: {
				true: 'field-sizing-content max-h-50 min-h-10 resize-none overflow-y-auto',
				false: 'min-h-16',
			},
		},
		defaultVariants: {
			autoResize: false,
		},
	},
);
