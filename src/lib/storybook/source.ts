import type { StoryContext } from '@storybook/vue3-vite';

function dedent(template: string) {
  const lines = template.replace(/^\n+/, '').trimEnd().split('\n');
  const indents = lines.filter(line => line.trim()).map(line => line.length - line.trimStart().length);

  return lines.map(line => line.slice(Math.min(...indents))).join('\n');
}

function kebab(name: string) {
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function attribute(name: string, value: unknown) {
  if (value === true)
    return ` ${kebab(name)}`;

  if (typeof value === 'string')
    return ` ${kebab(name)}="${value}"`;

  return ` :${kebab(name)}="${JSON.stringify(value).replaceAll('"', '\'')}"`;
}

function attributes(args: StoryContext['args']) {
  return Object.entries(args)
    .filter(([, value]) => value != null && typeof value !== 'function')
    .map(([name, value]) => attribute(name, value))
    .join('');
}

export function templateSource(code: string, context: StoryContext) {
  const story = context.originalStoryFn(context.args, context) as { template?: string };

  if (!story?.template)
    return code;

  return dedent(story.template).replaceAll(' v-bind="args"', attributes(context.args));
}
