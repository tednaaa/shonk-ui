import type { InjectionKey, Ref } from 'vue';
import type { ToggleVariants } from '../toggle';

export interface ToggleGroupContext {
	variant?: ToggleVariants['variant'];
	size?: ToggleVariants['size'];
	spacing: number;
}

export const toggleGroupKey: InjectionKey<Readonly<Ref<ToggleGroupContext>>> = Symbol('toggleGroup');
