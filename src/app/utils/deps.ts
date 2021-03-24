import { Module, ModuleDeps } from './types';

export function getModules(moduleDeps: ModuleDeps): Module[] {
  return moduleDeps.paths.map(path => moduleDeps.modules[path]);
}
