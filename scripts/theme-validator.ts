import type { CssStatement, VariableReference } from './theme-css';
import { readFileSync } from 'node:fs';
import { parseThemeCss, splitCss, ThemeCssError, variableReferences } from './theme-css';

export type ThemeMode = 'light' | 'dark';
export type ThemeScope = 'light' | 'dark-self' | 'dark-ancestor';

export interface ThemeDiagnostic {
  code: 'syntax' | 'unsupported' | 'missing-scope' | 'missing-variable' | 'invalid-value' | 'unresolved-reference' | 'cycle';
  message: string;
  file?: string;
  theme?: string;
  mode?: ThemeMode;
  scope?: ThemeScope;
  selector?: string;
  variable?: string;
  line?: number;
  column?: number;
}

export interface ThemeValidationResult {
  valid: boolean;
  themes: string[];
  diagnostics: ThemeDiagnostic[];
}

export interface ThemeValidationOptions {
  file?: string;
}

interface Selector {
  theme: string | null;
  generic: boolean;
  scope: ThemeScope;
  specificity: number;
}

interface Declaration {
  name: string;
  value: string;
  important: boolean;
  references: VariableReference[];
  offset: number;
}

interface ThemeRule extends Selector {
  selector: string;
  declarations: Declaration[];
  offset: number;
}

interface ParsedTheme {
  rules: ThemeRule[];
  mappings: Declaration[];
  diagnostics: ThemeDiagnostic[];
}

function selectorScope(selector: string): Selector | undefined {
  if (selector === ':root')
    return { theme: null, generic: false, scope: 'light', specificity: 1 };
  if (selector === '.dark' || selector === ':root.dark' || selector === '.dark:root')
    return { theme: null, generic: false, scope: 'dark-self', specificity: selector === '.dark' ? 1 : 2 };
  const match = /^(?:(\.dark)(\s*))?\[data-theme(?:\s*=\s*(?:"([^"\\]+)"|'([^'\\]+)'|([\w-]+)))?\s*\](\.dark)?$/.exec(selector);
  if (!match || (match[1] && match[6]))
    return undefined;
  const theme = match[3] ?? match[4] ?? match[5] ?? null;
  const scope = match[1] ? (match[2] ? 'dark-ancestor' : 'dark-self') : match[6] ? 'dark-self' : 'light';
  return { theme, generic: theme === null, scope, specificity: scope === 'light' ? 1 : 2 };
}

function position(css: string, offset: number): { line: number; column: number } {
  const lines = css.slice(0, offset).split('\n');
  return { line: lines.length, column: lines.at(-1)!.length + 1 };
}

function parse(css: string): ParsedTheme {
  const result: ParsedTheme = { rules: [], mappings: [], diagnostics: [] };
  const report = (code: 'syntax' | 'unsupported', message: string, offset: number, selector?: string) => {
    result.diagnostics.push({ code, message, selector, ...position(css, offset) });
  };

  function declarations(statements: CssStatement[]): Declaration[] {
    return statements.flatMap((statement) => {
      if (statement.children || statement.text.startsWith('@'))
        return [];
      const colon = statement.text.indexOf(':');
      if (colon < 1) {
        report('syntax', 'Expected a CSS declaration', statement.offset);
        return [];
      }
      const name = statement.text.slice(0, colon).trim();
      if (!name.startsWith('--'))
        return [];
      if (!/^--[\w-]+$/.test(name)) {
        report('unsupported', `Unsupported custom-property name: ${name}`, statement.offset);
        return [];
      }
      const raw = statement.text.slice(colon + 1).trim();
      const important = /!\s*important\s*$/i.test(raw);
      const value = raw.replace(/!\s*important\s*$/i, '').trim();
      try {
        return [{ name, value, important, references: variableReferences(value), offset: statement.offset }];
      }
      catch (error) {
        if (!(error instanceof ThemeCssError))
          throw error;
        report('syntax', `${name}: ${error.message}`, statement.offset + colon + 1 + error.offset);
        return [];
      }
    });
  }

  function visit(statements: CssStatement[], ancestors: string[] = []) {
    for (const statement of statements) {
      if (!statement.children) {
        if (/^@import\b/i.test(statement.text))
          report('unsupported', 'Validate standalone theme CSS without @import', statement.offset);
        else if (!ancestors.length && statement.text)
          report('syntax', 'Expected a CSS rule', statement.offset);
        continue;
      }
      if (statement.text === '@theme inline' && ancestors.length === 0) {
        result.mappings.push(...declarations(statement.children));
        continue;
      }
      const values = declarations(statement.children);
      if (!statement.text.startsWith('@')) {
        for (const selector of splitCss(statement.text, ',')) {
          const scope = selectorScope(selector);
          if (ancestors.length && values.length) {
            report('unsupported', 'Theme declarations must be in top-level rules, outside nesting and at-rules', statement.offset, selector);
          }
          else if (!scope && values.length) {
            report('unsupported', `Unsupported theme selector: ${selector}`, statement.offset, selector);
          }
          else if (scope && ancestors.length === 0) {
            result.rules.push({ ...scope, selector, declarations: values, offset: statement.offset });
          }
        }
      }
      else if (values.length) {
        report('unsupported', `Unsupported theme at-rule: ${statement.text}`, statement.offset);
      }
      visit(statement.children.filter(child => child.children || child.text.startsWith('@')), [...ancestors, statement.text]);
    }
  }

  try {
    visit(parseThemeCss(css));
  }
  catch (error) {
    if (!(error instanceof ThemeCssError))
      throw error;
    report('syntax', error.message, error.offset);
  }
  return result;
}

function allReferences(references: VariableReference[]): string[] {
  return references.flatMap(reference => [reference.name, ...allReferences(reference.fallback ?? [])]);
}

function cascade(rules: ThemeRule[]): Map<string, Declaration> {
  const values = new Map<string, Declaration>();
  for (const rule of rules.toSorted((a, b) => a.specificity - b.specificity)) {
    for (const declaration of rule.declarations) {
      if (values.get(declaration.name)?.important && !declaration.important)
        continue;
      values.set(declaration.name, declaration);
    }
  }
  return values;
}

function invalidValue(value: string): boolean {
  return !value || /^(?:initial|inherit|unset|revert|revert-layer)$/i.test(value);
}

let contract: ParsedTheme | undefined;

function getContract(): ParsedTheme {
  if (!contract) {
    contract = parse(readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8'));
    if (contract.diagnostics.length)
      throw new Error(`Invalid shonk-ui theme contract: ${contract.diagnostics[0]!.message}`);
  }
  return contract;
}

export function validateThemeCss(css: string, options: ThemeValidationOptions = {}): ThemeValidationResult {
  const parsed = parse(css);
  const library = getContract();
  const diagnostics = [...parsed.diagnostics];
  const shared = new Set(library.rules.filter(rule => rule.generic).flatMap(rule => rule.declarations.map(value => value.name)));
  const required = new Set(library.mappings.filter(value => value.name.startsWith('--color-')).flatMap(value => allReferences(value.references)).filter(name => !shared.has(name)));
  const themes = [...new Set(parsed.rules.filter(rule => !rule.generic).map(rule => rule.theme))];

  if (!themes.length)
    diagnostics.push({ code: 'missing-scope', message: 'No theme found; expected :root or [data-theme="name"] rules' });

  for (const theme of themes) {
    const scopes: ThemeScope[] = theme === null ? ['light', 'dark-self'] : ['light', 'dark-self', 'dark-ancestor'];
    for (const scope of scopes) {
      const mode: ThemeMode = scope === 'light' ? 'light' : 'dark';
      const ownRules = parsed.rules.filter(rule => !rule.generic && rule.theme === theme);
      const scopeRules = ownRules.filter(rule => rule.scope === scope);
      const report = (code: ThemeDiagnostic['code'], message: string, declaration?: Declaration, variable?: string) => {
        const declarationRules = declaration ? parsed.rules.filter(rule => rule.declarations.includes(declaration)) : scopeRules;
        const rule = declarationRules.find(rule => rule.scope === scope) ?? declarationRules[0];
        diagnostics.push({
          code,
          message,
          theme: theme ?? 'default',
          mode,
          scope,
          selector: rule?.selector,
          variable: declaration?.name ?? variable,
          ...(rule ? position(css, declaration?.offset ?? rule.offset) : {}),
        });
      };

      if (!scopeRules.length) {
        report('missing-scope', `Missing ${scope} theme scope`);
        continue;
      }
      const explicit = cascade(scopeRules);
      for (const name of required) {
        if (!explicit.has(name))
          report('missing-variable', `Missing required palette variable ${name}`, undefined, name);
      }

      const matches = (rule: ThemeRule) => rule.scope === 'light' || (mode === 'dark' && (rule.scope === scope || (!rule.generic && rule.theme === null)));
      const defaults = library.rules.filter(rule => (theme !== null || !rule.generic) && matches(rule)).map(rule => ({
        ...rule,
        specificity: rule.generic || theme === null || (scope === 'dark-self' && rule.scope === 'dark-self') ? rule.specificity : -1,
      }));
      const localRules = parsed.rules.filter(rule => matches(rule) && (rule.generic ? theme !== null : rule.theme === theme));
      const values = cascade([...defaults, ...localRules]);
      for (const name of required) {
        if (!explicit.has(name))
          values.delete(name);
      }

      const cycles = new Set<string>();
      const visited = new Set<string>();
      function visit(name: string, path: string[]) {
        if (path.includes(name)) {
          const cycle = path.slice(path.indexOf(name));
          if (!cycle.every(entry => cycles.has(entry))) {
            cycle.forEach(entry => cycles.add(entry));
            report('cycle', `Circular variable reference: ${[...cycle, name].join(' -> ')}`, values.get(name));
          }
          return;
        }
        if (visited.has(name))
          return;
        visited.add(name);
        for (const reference of allReferences(values.get(name)?.references ?? []))
          visit(reference, [...path, name]);
      }
      for (const name of values.keys())
        visit(name, []);

      const resolved = new Map<string, boolean>();
      function validReferences(references: VariableReference[]): boolean {
        return references.every(reference => validVariable(reference.name) || (reference.fallback !== undefined && validReferences(reference.fallback)));
      }
      function validVariable(name: string): boolean {
        if (resolved.has(name))
          return resolved.get(name)!;
        const declaration = values.get(name);
        if (!declaration || cycles.has(name) || invalidValue(declaration.value))
          return false;
        resolved.set(name, false);
        const valid = validReferences(declaration.references);
        resolved.set(name, valid);
        return valid;
      }

      for (const declaration of [...values.values(), ...library.mappings]) {
        if (invalidValue(declaration.value)) {
          report('invalid-value', `${declaration.name} needs a nonempty value, not an inheritance/reset keyword`, declaration);
        }
        else if (!cycles.has(declaration.name)) {
          for (const reference of declaration.references) {
            if (!validReferences([reference]))
              report('unresolved-reference', `${declaration.name} cannot resolve ${reference.name} or its fallback`, declaration);
          }
        }
      }
    }
  }

  return {
    valid: diagnostics.length === 0,
    themes: themes.map(theme => theme ?? 'default'),
    diagnostics: diagnostics.map(diagnostic => ({ ...diagnostic, file: options.file })),
  };
}
