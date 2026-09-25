export interface CssStatement {
  text: string;
  offset: number;
  children?: CssStatement[];
}

export interface VariableReference {
  name: string;
  fallback?: VariableReference[];
}

export class ThemeCssError extends Error {
  constructor(message: string, public offset: number) {
    super(message);
  }
}

function quotedEnd(text: string, start: number): number {
  for (let index = start + 1; index < text.length; index++) {
    if (text[index] === '\\') {
      index++;
    }
    else if (text[index] === text[start]) {
      return index + 1;
    }
    else if (text[index] === '\n' || text[index] === '\r') {
      throw new ThemeCssError('Unterminated CSS string', start);
    }
  }
  throw new ThemeCssError('Unterminated CSS string', start);
}

function withoutComments(css: string): string {
  const parts: string[] = [];
  let start = 0;
  for (let index = 0; index < css.length; index++) {
    if (css[index] === '"' || css[index] === '\'') {
      index = quotedEnd(css, index) - 1;
    }
    else if (css[index] === '\\') {
      index++;
    }
    else if (css.startsWith('/*', index)) {
      const end = css.indexOf('*/', index + 2);
      if (end === -1)
        throw new ThemeCssError('Unterminated CSS comment', index);
      parts.push(css.slice(start, index), css.slice(index, end + 2).replace(/[^\r\n]/g, ' '));
      index = end + 1;
      start = end + 2;
    }
  }
  parts.push(css.slice(start));
  return parts.join('');
}

function delimiter(text: string, start: number, stops: string): number {
  const groups: string[] = [];
  for (let index = start; index < text.length; index++) {
    const character = text[index]!;
    if (character === '"' || character === '\'') {
      index = quotedEnd(text, index) - 1;
    }
    else if (character === '\\') {
      index++;
    }
    else if (groups.length === 0 && stops.includes(character)) {
      return index;
    }
    else if (character === '(' || character === '[') {
      groups.push(character === '(' ? ')' : ']');
    }
    else if (character === ')' || character === ']') {
      if (groups.pop() !== character)
        throw new ThemeCssError(`Unexpected "${character}"`, index);
    }
    else if (groups.length > 0 && (character === '{' || character === '}')) {
      throw new ThemeCssError(`Unexpected "${character}" inside a CSS expression`, index);
    }
  }
  if (groups.length)
    throw new ThemeCssError(`Missing "${groups.at(-1)}"`, start);
  return text.length;
}

export function splitCss(text: string, separator: string): string[] {
  const parts: string[] = [];
  let start = 0;
  while (start <= text.length) {
    const end = delimiter(text, start, separator);
    parts.push(text.slice(start, end).trim());
    start = end + 1;
  }
  return parts;
}

export function parseThemeCss(css: string): CssStatement[] {
  const text = withoutComments(css);
  let index = 0;

  function statements(nested: boolean): CssStatement[] {
    const result: CssStatement[] = [];
    while (index < text.length) {
      while (/\s/.test(text[index] ?? '') && index < text.length)
        index++;
      const start = index;
      const end = delimiter(text, start, ';{}');
      const statement = { text: text.slice(start, end).trim(), offset: start };
      index = end + 1;
      if (text[end] === '{') {
        if (!statement.text)
          throw new ThemeCssError('Missing CSS selector', start);
        result.push({ ...statement, children: statements(true) });
      }
      else {
        if (statement.text)
          result.push(statement);
        if (text[end] === '}') {
          if (!nested)
            throw new ThemeCssError('Unexpected "}"', end);
          return result;
        }
      }
    }
    if (nested)
      throw new ThemeCssError('Missing "}"', text.length);
    return result;
  }

  return statements(false);
}

export function variableReferences(value: string): VariableReference[] {
  const references: VariableReference[] = [];
  for (let index = 0; index < value.length;) {
    if (value[index] === '"' || value[index] === '\'') {
      index = quotedEnd(value, index);
      continue;
    }
    if (value[index] === '\\')
      throw new ThemeCssError('Escaped CSS identifiers are not supported', index);
    const word = /^[\w-]+/.exec(value.slice(index))?.[0];
    if (!word) {
      index++;
      continue;
    }
    index += word.length;
    if (value[index] !== '(')
      continue;
    const end = delimiter(value, index + 1, ')');
    if (end === value.length)
      throw new ThemeCssError('Missing ")"', index);
    const argumentsText = value.slice(index + 1, end);
    if (word.toLowerCase() === 'var') {
      const comma = delimiter(argumentsText, 0, ',');
      const name = argumentsText.slice(0, comma).trim();
      if (!/^--[\w-]+$/.test(name))
        throw new ThemeCssError('var() requires a custom-property name', index);
      references.push({
        name,
        fallback: comma < argumentsText.length ? variableReferences(argumentsText.slice(comma + 1)) : undefined,
      });
    }
    else {
      references.push(...variableReferences(argumentsText));
    }
    index = end + 1;
  }
  return references;
}
