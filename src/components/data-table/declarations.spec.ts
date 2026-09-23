import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const entry = resolve(import.meta.dirname, '../../../dist/components/data-table/index.d.ts');

const relativeImport = /(?:from |import\()"(\.[^"]+)\.js"/g;

function reachableDeclarations(file: string, reached = new Set<string>()): Set<string> {
  if (reached.has(file))
    return reached;

  reached.add(file);

  for (const [, specifier] of readFileSync(file, 'utf8').matchAll(relativeImport))
    reachableDeclarations(resolve(dirname(file), `${specifier}.d.ts`), reached);

  return reached;
}

describe.runIf(existsSync(entry))('data-table declarations', () => {
  it('should not expose TanStack to the apps', () => {
    const declarations = [...reachableDeclarations(entry)];
    const leaking = declarations.filter(file => readFileSync(file, 'utf8').includes('@tanstack'));

    expect(declarations.length).toBeGreaterThan(1);
    expect(leaking).toEqual([]);
  });
});
