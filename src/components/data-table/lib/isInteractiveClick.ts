const interactiveSelector = [
  'a',
  'button',
  'input',
  'label',
  'select',
  'textarea',
  '[role=switch]',
  '[role=checkbox]',
  '[role=combobox]',
  '[role=menuitem]',
].join(', ');

export function isInteractiveClick({ target, currentTarget }: MouseEvent): boolean {
  if (!(target instanceof Element) || !(currentTarget instanceof Element))
    return false;

  const interactiveElement = target.closest(interactiveSelector);

  return interactiveElement !== null && currentTarget.contains(interactiveElement);
}
