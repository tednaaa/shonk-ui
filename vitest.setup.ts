import type { DOMWrapper, VueWrapper } from '@vue/test-utils';
import { config } from '@vue/test-utils';

type ElementSelector = Parameters<VueWrapper['findAll']>['0'];
type ComponentSelector = Parameters<VueWrapper['findAllComponents']>['0'];

declare module '@vue/test-utils' {
  interface VueWrapper {
    findComponentByText: (selector: ComponentSelector, text: string) => DOMWrapper<Element> | undefined;
    findElementByText: (selector: ElementSelector, text: string) => DOMWrapper<Element> | undefined;
    getComponentByText: (selector: ComponentSelector, text: string) => DOMWrapper<Element>;
    getElementByText: (selector: ElementSelector, text: string) => DOMWrapper<Element>;
  }

  interface DOMWrapper<NodeType extends Node> {
    findElementByText: (this: DOMWrapper<NodeType>, selector: ElementSelector, text: string) => DOMWrapper<Element> | undefined;
    getElementByText: (this: DOMWrapper<NodeType>, selector: ElementSelector, text: string) => DOMWrapper<Element>;
  }
}

function byText(elements: DOMWrapper<Element>[], text: string) {
  return elements.find(element => element.text().trim() === text.trim());
}

export function elementFindMethods(wrapper: VueWrapper | DOMWrapper<Node>) {
  return {
    findElementByText(selector: ElementSelector, text: string) {
      return byText(wrapper.findAll(selector), text);
    },
    getElementByText(selector: ElementSelector, text: string) {
      const element = byText(wrapper.findAll(selector), text);
      if (!element)
        throw new Error(`getElementByText: no <${selector}> element with text "${text}" found`);
      return element;
    },
  };
}

export function extraFindMethods(wrapper: VueWrapper) {
  return {
    ...elementFindMethods(wrapper),
    findComponentByText(selector: ComponentSelector, text: string) {
      return wrapper.findAllComponents(selector).find(element => element.text().trim() === text.trim());
    },
    getComponentByText(selector: ComponentSelector, text: string) {
      const element = wrapper.findAllComponents(selector).find(el => el.text().trim() === text.trim());
      if (!element)
        throw new Error(`getComponentByText: no <${selector}> component with text "${text}" found`);
      return element;
    },
  };
}

Element.prototype.scrollIntoView = vi.fn();

config.plugins.VueWrapper.install(extraFindMethods);
config.plugins.DOMWrapper.install(elementFindMethods);
