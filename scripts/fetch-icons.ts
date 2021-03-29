import { execSync } from 'child_process';
import { promises as fsp } from 'fs';
import fse from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git';

const git = simpleGit();

const outputDirPath = resolve(__dirname, '..', 'src', 'app', 'generated');
const iconsDirPath = resolve(outputDirPath, 'icons');
const iconsMapFilePath = resolve(outputDirPath, 'icon-map.json');

const vsCodeExtDirName = 'tmp';
const vsCodeExtDirPath = resolve(__dirname, '..', vsCodeExtDirName);

async function fetchIcons(): Promise<void> {
  await fsp.rmdir(vsCodeExtDirPath, { recursive: true });
  await fsp.rmdir(outputDirPath, { recursive: true });
  await fsp.mkdir(iconsDirPath, { recursive: true });
  await git.clone(
    'git@github.com:PKief/vscode-material-icon-theme.git',
    vsCodeExtDirName,
  );
  execSync('npm install', {
    cwd: vsCodeExtDirPath,
    stdio: 'inherit',
  });
  await fse.copy(resolve(vsCodeExtDirPath, 'icons'), iconsDirPath);
  execSync('npm run build', {
    cwd: vsCodeExtDirPath,
    stdio: 'inherit',
  });
  await fsp.copyFile(
    resolve(vsCodeExtDirPath, 'dist', 'material-icons.json'),
    resolve(iconsMapFilePath),
  );
  await fsp.rmdir(vsCodeExtDirPath, { recursive: true });
}

fetchIcons().catch(console.error);
