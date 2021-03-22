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

  const result: DepGraph = {
    modules: [],
    imports: [],
  };
  const roots = new Set(sourceModules);
  const reachableRoots = new Set<string>();

  const queue = [...targetModules];
  const discovered = new Set([...targetModules, ...sourceModules]);

  while (queue.length > 0) {
    const tgtModulePath = queue.shift()!;
    result.modules.push(moduleDeps.modules[tgtModulePath]);

    const adjacent = moduleDeps.importedBy[tgtModulePath] ?? [];
    for (const { path: srcModulePath, isDynamic } of adjacent) {
      result.imports.push({
        fromPath: srcModulePath,
        toPath: tgtModulePath,
        isDynamic,
      });

      if (roots.has(srcModulePath)) {
        reachableRoots.add(srcModulePath);
      }

      if (!discovered.has(srcModulePath)) {
        queue.push(srcModulePath);
        discovered.add(srcModulePath);
      }
    }
  }

  reachableRoots.forEach(modulePath => {
    result.modules.push(moduleDeps.modules[modulePath]);
  });

  return result;
}
