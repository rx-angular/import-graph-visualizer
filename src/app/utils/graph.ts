import { DepGraph, Module, ModuleDeps } from './types';

export function getModules(moduleDeps: ModuleDeps): Module[] {
  return moduleDeps.paths.map(path => moduleDeps.modules[path]);
}

export function createDepGraph(args: {
  moduleDeps: ModuleDeps;
  sourceModules: string[];
  targetModules: string[];
}): DepGraph {
  const { moduleDeps, sourceModules, targetModules } = args;

  const paths = findAllPaths(
    targetModules,
    sourceModules,
    module => moduleDeps.importedBy[module]?.map(({ path }) => path) ?? [],
  );

  const relevantModules = new Set<string>();
  paths.forEach(path => {
    path.forEach(module => {
      relevantModules.add(module);
    });
  });

  return {
    modules: Array.from(relevantModules).map(
      module => moduleDeps.modules[module],
    ),
    imports: Array.from(relevantModules).reduce<DepGraph['imports']>(
      (acc, module) => [
        ...acc,
        ...(moduleDeps.importedBy[module]
          ?.filter(({ path }) => relevantModules.has(path))
          .map(({ path, isDynamic }) => ({
            fromPath: path,
            toPath: module,
            isDynamic,
          })) ?? []),
      ],
      [],
    ),
  };
}

function findAllPaths<T>(
  from: T[],
  to: T[],
  adjacent: (vertex: T) => T[],
): T[][] {
  const ends = new Set(to);
  const isPathEnd = (vertex: T) => ends.has(vertex);

  const paths: T[][] = [];
  for (const vertex of from) {
    const visited = new Set<T>();
    const path: T[] = [];
    findAllPathsUtil(vertex, isPathEnd, adjacent, visited, path, paths);
  }

  return paths;
}

function findAllPathsUtil<T>(
  vertex: T,
  isPathEnd: (vertex: T) => boolean,
  adjacent: (vertex: T) => T[],
  visited: Set<T>,
  path: T[],
  paths: T[][],
): void {
  visited.add(vertex);
  path.push(vertex);

  if (isPathEnd(vertex)) {
    paths.push([...path]);
  } else {
    for (const other of adjacent(vertex)) {
      if (!visited.has(other)) {
        findAllPathsUtil(other, isPathEnd, adjacent, visited, path, paths);
      }
    }
  }

  visited.delete(vertex);
  path.pop();
}
