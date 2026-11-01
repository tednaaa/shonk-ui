import type { FunctionalComponent, VNodeChild } from 'vue';

export const RenderNode: FunctionalComponent<{ node: VNodeChild }> = props => props.node;
