import ChartTooltipContent from './ChartTooltipContent.vue';
import { componentToString } from './componentToString';

const config = {
  inbound: { label: 'Inbound' },
  outbound: { label: 'Outbound' },
};

const january = new Date(2026, 0, 1);

function texts(html: string) {
  const element = document.createElement('div');
  element.innerHTML = html;

  return [...element.querySelectorAll('span')].map(span => span.textContent);
}

it('lists the configured series in config order with their formatted values', () => {
  const tooltip = componentToString(config, ChartTooltipContent, { valueFormatter: value => `${value} calls` });

  expect(texts(tooltip({ date: january, outbound: 0, inbound: 1860 }, january)))
    .toEqual(['Inbound', '1860 calls', 'Outbound', '0 calls']);
});

it('skips a series the datum has no value for', () => {
  const tooltip = componentToString(config, ChartTooltipContent);

  expect(texts(tooltip({ inbound: 5, outbound: null }, january))).toEqual(['Inbound', '5']);
});
