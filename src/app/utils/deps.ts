import { DepGraph, Module, ModuleDeps } from './types';

export function getModules(moduleDeps: ModuleDeps): Module[] {
  return moduleDeps.paths.map(path => moduleDeps.modules[path]);
}

export function createDepGraph(args: {
  moduleDeps: ModuleDeps;
  rootModules: string[];
  leafModules: string[];
}): DepGraph {
  const { moduleDeps, rootModules, leafModules } = args;

  const result: DepGraph = {
    modules: [],
    imports: [],
  };
  const leaves = new Set(leafModules);
  const reachableLeaves = new Set<string>();

  const queue = [...rootModules];
  const discovered = new Set([...leafModules, ...rootModules]);

  while (queue.length > 0) {
    const srcModulePath = queue.shift()!;
    result.modules.push(moduleDeps.modules[srcModulePath]);

    const adjacent = moduleDeps.deps[srcModulePath] ?? [];
    for (const { path: tgtModulePath, isDynamic } of adjacent) {
      result.imports.push({
        fromPath: srcModulePath,
        toPath: tgtModulePath,
        isDynamic,
      });

      if (leaves.has(tgtModulePath)) {
        reachableLeaves.add(tgtModulePath);
      }

      if (!discovered.has(tgtModulePath)) {
        queue.push(tgtModulePath);
        discovered.add(tgtModulePath);
      }
    }
  }

  reachableLeaves.forEach(leafModule => {
    result.modules.push(moduleDeps.modules[leafModule]);
  });

  return result;
}
