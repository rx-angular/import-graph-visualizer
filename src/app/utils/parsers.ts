import { ICruiseResult } from 'dependency-cruiser';
import { Module, ModuleDeps, ModuleImportMap } from './types';

export function parseModuleDeps(result: ICruiseResult): ModuleDeps {
  const localModules = new Set<string>();
  const aliases = new Map<string, string>();
  const npmPackageNames = new Map<string, string>();
  const sourceDeps = new Map<
    string,
    { source: string; isDynamic: boolean }[]
  >();
  const sourceImportedBy = new Map<
    string,
    { source: string; isDynamic: boolean }[]
  >();

  result.summary.optionsUsed.args?.split(/\s+/).forEach(entryPoint => {
    localModules.add(entryPoint);
  });

  result.modules.forEach(module => {
    module.dependencies.forEach(dependency => {
      sourceDeps.set(module.source, [
        ...(sourceDeps.get(module.source) ?? []),
        { source: dependency.resolved, isDynamic: dependency.dynamic },
      ]);
      sourceImportedBy.set(dependency.resolved, [
        ...(sourceImportedBy.get(dependency.resolved) ?? []),
        { source: module.source, isDynamic: dependency.dynamic },
      ]);

      if (dependency.dependencyTypes.includes('local')) {
        localModules.add(dependency.resolved);
      }
      if (dependency.dependencyTypes.includes('aliased')) {
        aliases.set(dependency.resolved, dependency.module);
        localModules.add(dependency.resolved);
      } else if (
        dependency.dependencyTypes.some(type => type.startsWith('npm'))
      ) {
        npmPackageNames.set(dependency.resolved, dependency.module);
      }
    });
  });

  const allModules = result.modules
    .map((module): Module => {
      const npmPackageName = npmPackageNames.get(module.source);
      const alias = aliases.get(module.source);
      const isLocal = localModules.has(module.source);
      return {
        path: npmPackageName ?? module.source,
        source: module.source,
        isLocal,
        ...(alias && { alias }),
      };
    })
    .filter(
      (item, index, array) =>
        array.findIndex(({ path }) => path === item.path) === index,
    )
    .sort((a, b) => a.path.localeCompare(b.path));

  const { moduleBySource, moduleByPath } = allModules.reduce<{
    moduleBySource: Record<string, Module>;
    moduleByPath: Record<string, Module>;
  }>(
    (acc, module) => ({
      moduleBySource: { ...acc.moduleBySource, [module.source]: module },
      moduleByPath: { ...acc.moduleByPath, [module.path]: module },
    }),
    { moduleBySource: {}, moduleByPath: {} },
  );

  const pathDeps: ModuleImportMap = {};
  sourceDeps.forEach((value, key) => {
    pathDeps[moduleBySource[key].path] = value.map(({ source, isDynamic }) => ({
      path: moduleBySource[source].path,
      isDynamic,
    }));
  });
  const pathImportedBy: ModuleImportMap = {};
  sourceImportedBy.forEach((value, key) => {
    pathImportedBy[moduleBySource[key].path] = value.map(
      ({ source, isDynamic }) => ({
        path: moduleBySource[source].path,
        isDynamic,
      }),
    );
  });

  return {
    modules: moduleByPath,
    paths: allModules.map(({ path }) => path),
    deps: pathDeps,
    importedBy: pathImportedBy,
  };
}
