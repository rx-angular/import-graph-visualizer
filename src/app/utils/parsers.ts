import { ICruiseResult } from 'dependency-cruiser';
import { Module, ModuleDeps } from './types';

export function parseModuleDeps(result: ICruiseResult): ModuleDeps {
  const localModules = new Map<string, boolean>();
  const aliases = new Map<string, string>();
  const npmPackageNames = new Map<string, string>();
  const sourceDeps = new Map<
    string,
    { source: string; isDynamic: boolean }[]
  >();
  result.modules.forEach(module => {
    module.dependencies.forEach(dependency => {
      sourceDeps.set(module.source, [
        ...(sourceDeps.get(module.source) ?? []),
        { source: dependency.resolved, isDynamic: dependency.dynamic },
      ]);
      if (dependency.dependencyTypes.includes('local')) {
        localModules.set(dependency.resolved, true);
      }
      if (dependency.dependencyTypes.includes('aliased')) {
        aliases.set(dependency.resolved, dependency.module);
        localModules.set(dependency.resolved, true);
      } else if (
        dependency.dependencyTypes.some(type => type.startsWith('npm'))
      ) {
        npmPackageNames.set(dependency.resolved, dependency.module);
      }
    });
  });

  const allModules = result.modules
    .map(
      (module): Module => {
        const npmPackageName = npmPackageNames.get(module.source);
        const alias = aliases.get(module.source);
        const isLocal = localModules.get(module.source) ?? false;
        return {
          path: npmPackageName ?? module.source,
          source: module.source,
          isLocal,
          ...(alias && { alias }),
        };
      },
    )
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

  const pathDeps: ModuleDeps['deps'] = {};
  sourceDeps.forEach((value, key) => {
    pathDeps[moduleBySource[key].path] = value.map(({ source, isDynamic }) => ({
      path: moduleBySource[source].path,
      isDynamic,
    }));
  });

  return {
    modules: moduleByPath,
    paths: allModules.map(({ path }) => path),
    deps: pathDeps,
  };
}
