import createGraphModule, { GraphEmscriptenModule } from './generated/graph.js';
import wasmFileUrl from './generated/graph.wasm';

export type WebAssemblyModule = GraphEmscriptenModule & {
  findAllPaths: (graph: {
    sources: string[];
    targets: string[];
    adjacent: Record<string, string[]>;
  }) => string[][];
};

export async function loadWebAssemblyModule(): Promise<WebAssemblyModule> {
  const graphModule = await createGraphModule({
    locateFile: () => wasmFileUrl,
  });
  const findAllPaths: (
    buffer: number,
  ) => string = graphModule.cwrap('findAllPaths', 'string', ['number']);
  return {
    ...graphModule,
    findAllPaths: graph => {
      const input = JSON.stringify(graph);
      const inputLength = graphModule.lengthBytesUTF8(input) + 1;
      const buffer = graphModule._malloc(inputLength);
      graphModule.stringToUTF8(input, buffer, inputLength);
      const result = findAllPaths(buffer);
      graphModule._free(buffer);
      return JSON.parse(result);
    },
  };
}
