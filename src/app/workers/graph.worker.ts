import { loadWebAssemblyModule, WebAssemblyModule } from '../../wasm';
import { DepGraph, GraphWorkerArgs } from '../utils/types';

const ctx: Worker = self as any;

const wasmPromise = loadWebAssemblyModule();

type DepGraphArgs = GraphWorkerArgs & {
  findAllPaths: WebAssemblyModule['findAllPaths'];
};

ctx.addEventListener('message', async (ev: MessageEvent<GraphWorkerArgs>) => {
  const wasm = await wasmPromise;
  ctx.postMessage(
    createDepGraph({ ...ev.data, findAllPaths: wasm.findAllPaths }),
  );
});

function createDepGraph(args: DepGraphArgs): DepGraph {
  const { moduleDeps, sourceModules, targetModules, findAllPaths } = args;

  const paths = findAllPaths({
    sources: targetModules,
    targets: sourceModules,
    adjacent: Object.keys(moduleDeps.modules).reduce(
      (acc, modulePath) => ({
        ...acc,
        [modulePath]:
          moduleDeps.importedBy[modulePath]?.map(({ path }) => path) ?? [],
      }),
      {} as Record<string, string[]>,
    ),
  });

  const relevantModules = new Set<string>();
  paths.forEach(path => {
    path.forEach(module => {
      relevantModules.add(module);
    });
  });

  return {
    modules: Array.from(relevantModules).map(
      module => moduleDeps.modules[module],
    ),
    imports: Array.from(relevantModules).reduce<DepGraph['imports']>(
      (acc, module) => [
        ...acc,
        ...(moduleDeps.importedBy[module]
          ?.filter(({ path }) => relevantModules.has(path))
          .map(({ path, isDynamic }) => ({
            fromPath: path,
            toPath: module,
            isDynamic,
          })) ?? []),
      ],
      [],
    ),
  };
}
