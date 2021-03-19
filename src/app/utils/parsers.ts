import { ICruiseResult } from 'dependency-cruiser';
import { Module } from './types';

export function parseModules(result: ICruiseResult): Module[] {
  const localModules = new Map<string, boolean>();
  const aliases = new Map<string, string>();
  const npmPackageNames = new Map<string, string>();
  result.modules.forEach(module => {
    module.dependencies.forEach(dependency => {
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

  const modules = result.modules.map(
    (module): Module => {
      const npmPackageName = npmPackageNames.get(module.source);
      const alias = aliases.get(module.source);
      const isLocal = localModules.get(module.source) ?? false;
      return {
        path: npmPackageName ?? module.source,
        isLocal,
        ...(alias && { alias }),
      };
    },
  );
  return modules
    .filter(
      (item, index, array) =>
        array.findIndex(({ path }) => path === item.path) === index,
    )
    .sort((a, b) => a.path.localeCompare(b.path));
}
