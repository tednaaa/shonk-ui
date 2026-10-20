import type { InjectionKey, Ref } from 'vue';
import type { ButtonVariants } from '../button';

export interface ToggleGroupContext {
	variant?: ButtonVariants['variant'];
	size?: ButtonVariants['size'];
	spacing: number;
}

export const toggleGroupKey: InjectionKey<Readonly<Ref<ToggleGroupContext>>> = Symbol('toggleGroup');
