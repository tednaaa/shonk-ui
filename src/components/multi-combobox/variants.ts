import { cva } from 'class-variance-authority';

export const multiComboboxTriggerVariants = cva('w-full justify-start bg-field font-normal text-field-foreground', {
	variants: {
		showClear: {
			true: 'pr-14',
			false: 'pr-9',
		},
		placeholder: {
			true: 'text-muted-foreground',
			false: '',
		},
	},
	defaultVariants: {
		showClear: false,
		placeholder: false,
	},
});
