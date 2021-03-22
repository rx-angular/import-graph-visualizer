export type Module = {
  path: string;
  source: string;
  alias?: string;
  isLocal: boolean;
};

export type ModuleDeps = {
  modules: Record<string, Module>;
  paths: string[];
  deps: Record<string, { path: string; isDynamic: boolean }[]>;
};

export type DepGraph = {
  modules: Module[];
  imports: {
    fromPath: string;
    toPath: string;
    isDynamic: boolean;
  }[];
};

export type Filters = {
  rootModules: string[];
  leafModules: string[];
};
