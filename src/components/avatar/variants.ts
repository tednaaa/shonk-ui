import { cva } from 'class-variance-authority';

export const avatarFallbackVariants = cva(
	'@container flex size-full items-center justify-center rounded-full',
	{
		variants: {
			tone: {
				none: 'bg-accent text-accent-foreground',
				1: 'bg-[color-mix(in_oklab,var(--chart-1)_20%,var(--background))] text-[color-mix(in_oklab,var(--chart-1)_60%,var(--foreground))]',
				2: 'bg-[color-mix(in_oklab,var(--chart-2)_20%,var(--background))] text-[color-mix(in_oklab,var(--chart-2)_60%,var(--foreground))]',
				3: 'bg-[color-mix(in_oklab,var(--chart-3)_20%,var(--background))] text-[color-mix(in_oklab,var(--chart-3)_60%,var(--foreground))]',
				4: 'bg-[color-mix(in_oklab,var(--chart-4)_20%,var(--background))] text-[color-mix(in_oklab,var(--chart-4)_60%,var(--foreground))]',
				5: 'bg-[color-mix(in_oklab,var(--chart-5)_20%,var(--background))] text-[color-mix(in_oklab,var(--chart-5)_60%,var(--foreground))]',
			},
		},
		defaultVariants: {
			tone: 'none',
		},
	},
);

export const avatarGroupVariants = cva(
	'flex -space-x-2 **:data-[slot=avatar]:border-2 **:data-[slot=avatar]:border-background **:data-[slot=avatar]:bg-background',
	{
		variants: {
			interactive: {
				true: '*:relative *:duration-300 *:ease-in-out *:before:absolute *:before:inset-x-0 *:before:top-0 *:before:-bottom-1 *:hover:-translate-y-1 *:focus-visible:z-10 *:focus-visible:-translate-y-1 *:has-focus-visible:z-10 *:has-focus-visible:-translate-y-1 *:motion-safe:transition-transform',
				false: '',
			},
		},
		defaultVariants: {
			interactive: false,
		},
	},
);
