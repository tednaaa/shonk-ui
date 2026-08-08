import { expect, it } from 'vitest';
import { render } from 'vitest-browser-vue';
import { Button } from '../src';

it.skip('button', () => {
  const page = render(Button, {
    props: { variant: 'primary' },
  });

  expect(page.container.textContent).toMatchInlineSnapshot(`" my button type: primary count: 0"`);
  expect(page.container.innerHTML).toMatchInlineSnapshot(`"<button class="my-button"> my button<br> type: primary<br> count: 0</button>"`);
});
