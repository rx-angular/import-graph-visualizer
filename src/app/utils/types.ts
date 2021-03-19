export type Module = {
  path: string;
  source: string;
  alias?: string;
  isLocal: boolean;
};

export type ModuleDeps = {
  modules: Record<string, Module>;
  paths: string[];
  deps: Record<string, string[]>;
};
