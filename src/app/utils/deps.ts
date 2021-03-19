import { Module, ModuleDeps } from './types';

export function getModules(moduleDeps: ModuleDeps): Module[] {
  return moduleDeps.paths.map(path => moduleDeps.modules[path]);
}

// TODO: implement
export declare function createGraph(args: {
  moduleDeps: ModuleDeps;
  rootModules: string[];
  leafModules: string[];
}): {
  modules: Module[];
  imports: { fromPath: string; toPath: string }[];
};
