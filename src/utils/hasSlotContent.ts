import type { Slot, VNode } from 'vue';
import { Comment, Fragment, Text } from 'vue';

function hasContent(vnodes: VNode[]): boolean {
  return vnodes.some((vnode) => {
    if (vnode.type === Comment)
      return false;
    if (vnode.type === Text)
      return Boolean((vnode.children as string).trim());
    if (vnode.type === Fragment)
      return hasContent((vnode.children as VNode[]) ?? []);
    return true;
  });
}

export function hasSlotContent(slot: Slot | undefined): boolean {
  return slot ? hasContent(slot()) : false;
}
