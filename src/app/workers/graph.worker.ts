import { DepGraph, ModuleDeps } from '../utils/types';

const ctx: Worker = self as any;

type Args = {
  moduleDeps: ModuleDeps;
  sourceModules: string[];
  targetModules: string[];
};

ctx.addEventListener('message', (ev: MessageEvent<Args>) => {
  ctx.postMessage(createDepGraph(ev.data));
});

function createDepGraph(args: Args): DepGraph {
  const { moduleDeps, sourceModules, targetModules } = args;

  if (sourceModules.length === 0) {
    const { vertices, edges } = bfs(
      targetModules,
      module => moduleDeps.importedBy[module]?.map(({ path }) => path) ?? [],
    );
    return {
      modules: vertices.map(module => moduleDeps.modules[module]),
      imports: edges.map(({ from, to }) => ({
        fromPath: from,
        toPath: to,
        isDynamic:
          moduleDeps.importedBy[from].find(({ path }) => path === to)
            ?.isDynamic ?? false,
      })),
    };
  }

  if (targetModules.length === 0) {
    const { vertices, edges } = bfs(
      sourceModules,
      module => moduleDeps.deps[module]?.map(({ path }) => path) ?? [],
    );
    return {
      modules: vertices.map(module => moduleDeps.modules[module]),
      imports: edges.map(({ from, to }) => ({
        fromPath: from,
        toPath: to,
        isDynamic:
          moduleDeps.deps[from].find(({ path }) => path === to)?.isDynamic ??
          false,
      })),
    };
  }

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

function bfs<T>(
  from: T[],
  adjacent: (vertex: T) => T[],
): {
  vertices: T[];
  edges: { from: T; to: T }[];
} {
  const queue = from;
  const discovered = new Set(from);
  const vertices: T[] = [];
  const edges: { from: T; to: T }[] = [];
  while (queue.length > 0) {
    const vertex = queue.shift()!;
    vertices.push(vertex);
    for (const other of adjacent(vertex)) {
      edges.push({ from: vertex, to: other });
      if (!discovered.has(other)) {
        queue.push(other);
        discovered.add(other);
      }
    }
  }
  return { vertices, edges };
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
