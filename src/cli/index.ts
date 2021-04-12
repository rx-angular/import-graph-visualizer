import { cruise, ICruiseOptions } from 'dependency-cruiser';
import * as fs from 'fs';
import * as path from 'path';
import * as typescript from 'typescript';
import * as yargs from 'yargs';

const args = yargs
  .option('entry-points', {
    alias: 'e',
    demandOption: true,
    array: true,
    string: true,
  })
  .option('ts-config', {
    alias: 't',
    demandOption: false,
    string: true,
  }).argv;

const entryPoints = args['entry-points'];
const tsConfigFileName = args['ts-config'];

const tsConfig =
  tsConfigFileName == null
    ? null
    : typescript.parseJsonConfigFileContent(
        typescript.readConfigFile(tsConfigFileName, typescript.sys.readFile)
          .config,
        typescript.sys,
        path.dirname(tsConfigFileName),
        {},
        tsConfigFileName,
      );

const options: ICruiseOptions = {
  doNotFollow: {
    path: 'node_modules',
    dependencyTypes: [
      'npm',
      'npm-dev',
      'npm-optional',
      'npm-peer',
      'npm-bundled',
      'npm-no-pkg',
    ],
  },
  tsPreCompilationDeps: true,
};

const { output } = cruise(
  entryPoints,
  {
    ruleSet: {
      options: { ...options, tsConfig: { fileName: tsConfigFileName } },
    },
  } as any,
  null,
  tsConfig,
);

fs.writeFileSync(
  path.resolve(__dirname, 'reporter-output.json'),
  JSON.stringify(output),
);
