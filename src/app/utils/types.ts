export type Module = {
  path: string;
  source: string;
  alias?: string;
  isLocal: boolean;
  isNodeBuiltIn: boolean;
};

export type ModuleDeps = {
  modules: Record<string, Module>;
  paths: string[];
  deps: ModuleImportMap;
  importedBy: ModuleImportMap;
};

export type ModuleImportMap = Record<
  string,
  { path: string; isDynamic: boolean }[]
>;

export type DepGraph = {
  modules: Module[];
  imports: {
    fromPath: string;
    toPath: string;
    isDynamic: boolean;
  }[];
};

export type Filters = {
  targetModules: string[];
  sourceModules: string[];
};
