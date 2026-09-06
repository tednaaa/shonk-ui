import type { StoryContext } from '@storybook/vue3-vite';
import { isRef } from 'vue';

const INLINE_WIDTH = 72;
const IMPORT_WIDTH = 100;

const otherSources: Record<string, string> = {
  VisuallyHidden: 'reka-ui',
};

const storybookOnly = new Set(['StoryLabel']);

function dedent(template: string) {
  const lines = template.replace(/^\n+/, '').trimEnd().split('\n');
  const indents = lines.filter(line => line.trim()).map(line => line.length - line.trimStart().length);

  return lines.map(line => line.slice(Math.min(...indents))).join('\n');
}

function indent(template: string) {
  return template.split('\n').map(line => line.trim() ? `  ${line}` : line).join('\n');
}

function kebab(name: string) {
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function quoted(json: string) {
  return json.replaceAll('"', '\'').replace(/'([a-z_]\w*)':/gi, '$1:');
}

function literal(value: unknown): string {
  if (Array.isArray(value)) {
    const items = value.map(item => literal(item));
    const single = `[${items.join(', ')}]`;

    return single.length <= INLINE_WIDTH ? single : `[\n  ${items.join(',\n  ')},\n]`;
  }

  const pretty = JSON.stringify(value, null, 2);
  const single = pretty.replace(/\n\s*/g, ' ').replace(/\[ /g, '[').replace(/ \]/g, ']');

  return quoted(single.length <= INLINE_WIDTH ? single : pretty);
}

function serialisable(value: unknown): boolean {
  if (value === null || value === undefined)
    return true;

  if (Array.isArray(value))
    return value.every(serialisable);

  if (typeof value === 'object')
    return Object.getPrototypeOf(value) === Object.prototype && Object.values(value).every(serialisable);

  return ['boolean', 'number', 'string'].includes(typeof value);
}

function attribute(name: string, value: unknown) {
  if (value === true)
    return ` ${kebab(name)}`;

  if (typeof value === 'string')
    return ` ${kebab(name)}="${value}"`;

  return ` :${kebab(name)}="${JSON.stringify(value).replaceAll('"', '\'')}"`;
}

function attributes(args: StoryContext['args']) {
  return Object.entries(args ?? {})
    .filter(([, value]) => value != null && typeof value !== 'function')
    .map(([name, value]) => attribute(name, value))
    .join('');
}

function sourceOf(component: string) {
  if (component.endsWith('Icon'))
    return '@lucide/vue';

  return otherSources[component] ?? 'shonk-ui';
}

function importLine(source: string, names: string[]) {
  const single = `import { ${names.join(', ')} } from '${source}';`;

  return single.length <= IMPORT_WIDTH
    ? single
    : `import {\n${names.map(name => `  ${name},`).join('\n')}\n} from '${source}';`;
}

function importsFor(components: Record<string, unknown>, usesRef: boolean) {
  const bySource = new Map<string, string[]>();

  for (const component of Object.keys(components)) {
    if (storybookOnly.has(component))
      continue;

    const source = sourceOf(component);
    bySource.set(source, [...bySource.get(source) ?? [], component]);
  }

  if (usesRef)
    bySource.set('vue', ['ref']);

  return [...bySource]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([source, names]) => importLine(source, names.sort()));
}

function stateFor(setup: (() => unknown) | undefined) {
  const nothing = { declarations: [] as string[], usesRef: false };

  if (!setup)
    return nothing;

  let bindings;

  try {
    bindings = setup();
  }
  catch {
    return nothing;
  }

  if (!bindings || typeof bindings !== 'object')
    return nothing;

  const entries = Object.entries(bindings)
    .filter(([name]) => name !== 'args')
    .map(([name, value]) => [name, isRef(value), isRef(value) ? value.value : value] as const);

  if (!entries.every(([,, value]) => serialisable(value)))
    return nothing;

  return {
    declarations: entries.map(([name, reactive, value]) => reactive
      ? `const ${name} = ref(${value === undefined ? '' : literal(value)});`
      : `const ${name} = ${literal(value)};`),
    usesRef: entries.some(([, reactive]) => reactive),
  };
}

function withoutStoryLabels(template: string) {
  return template
    .replace(/^[ \t]*<StoryLabel>.*?<\/StoryLabel>[ \t]*\n/gm, '')
    .replace(/<StoryLabel>.*?<\/StoryLabel>/g, '');
}

export function templateSource(code: string, context: StoryContext) {
  const story = context.originalStoryFn(context.args, context) as {
    template?: string;
    components?: Record<string, unknown>;
    setup?: () => unknown;
  };

  if (!story?.template)
    return code;

  const markup = indent(dedent(withoutStoryLabels(story.template)).replaceAll(' v-bind="args"', attributes(context.args)));
  const template = `<template>\n${markup}\n</template>`;

  const { declarations, usesRef } = stateFor(story.setup);
  const imports = importsFor(story.components ?? {}, usesRef);
  const script = [imports.join('\n'), declarations.join('\n')].filter(Boolean).join('\n\n');

  if (!script)
    return template;

  return `<script setup lang="ts">\n${script}\n</script>\n\n${template}`;
}
