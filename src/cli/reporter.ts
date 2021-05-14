import { cruise, ICruiseOptions } from 'dependency-cruiser';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import typescript from 'typescript';
import yargs from 'yargs';

export function createReporterOutput(): void {
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

  const cruiseSpinner = ora('Analyzing project imports').start();
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
  cruiseSpinner.succeed('Analyzed project imports');

  const fsSpinner = ora('Creating dependency graph').start();
  fs.writeFileSync(
    path.resolve(__dirname, 'reporter-output.json'),
    JSON.stringify(output),
  );
  fsSpinner.succeed('Created dependency graph');
}

if (require.main === module) {
  createReporterOutput();
}
