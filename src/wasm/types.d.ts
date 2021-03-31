/// <reference types="emscripten" />

declare module '*.wasm' {
  declare const url: string;
  export default url;
}

declare module '*/generated/graph.js' {
  export interface GraphEmscriptenModule extends EmscriptenModule {
    cwrap: typeof cwrap;
    stringToUTF8: typeof stringToUTF8;
    lengthBytesUTF8: typeof lengthBytesUTF8;
  }

  export type GraphEmscriptenModuleFactory = EmscriptenModuleFactory<GraphEmscriptenModule>;

  declare const graphModuleFactory: GraphEmscriptenModuleFactory;

  export default graphModuleFactory;
}
