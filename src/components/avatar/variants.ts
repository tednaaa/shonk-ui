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
