import {existsSync, promises, writeFileSync} from 'fs';
import * as path from 'path';
import {executeCommand} from './command-utils';
import {PackageInformation} from './interfaces';
import {PackageError} from './models';
import {compile} from './webpack-compile';

const tmpFolderPath = path.join('..','..','tmp');

export async function buildPackage(packageName: string, packageVersion: string): Promise<PackageInformation> {
  const packageNameAndVersion: string = `${packageName}@${packageVersion}`;
  const buildPath: string = await getBuildPathAndCreateFolders(packageName, packageVersion);

  try {
    await addPackageDependency(packageNameAndVersion, buildPath);
  } catch ({error}) {
    throw new PackageError({name:'AddDependencyError', message:`Failed to add dependencies for ${packageName}@${packageVersion}`}, packageName, packageVersion);
  }
  const entryFilePath: string = createEntryFile(buildPath, packageName);
  return await compile(packageName, packageVersion, buildPath, entryFilePath);
}

async function getBuildPathAndCreateFolders(packageName: string, packageVersion: string): Promise<string> {
  const packages = packageName.split('/');
  packages[packages.length - 1] += '_' +  packageVersion;
  const folders = [tmpFolderPath, ...packages];
  return await folders.reduce(async (accumulator: Promise<string>, currentFolder): Promise<string>=>{
    const currentFolderPath = await accumulator;
    const nextFolderPath = currentFolderPath ? path.join(currentFolderPath, currentFolder) : currentFolder;
    await mkdirIfNeeded(nextFolderPath);
    return nextFolderPath;
  }, new Promise<string>((resolve) => resolve('')));
}


function createEntryFile(buildPath: string, packageName: string): string {
  const entryFilePath = path.join(buildPath, 'index.js');
  const entryFileContent = `const m=require('${packageName}');`;
  writeFileSync(entryFilePath, entryFileContent, 'utf-8');
  return entryFilePath;
}

async function mkdirIfNeeded(folderPath: string) {
  if (!existsSync(folderPath)) {
    try {
      await promises.mkdir(folderPath);
    } catch(e) {
      console.error(e);
    }
  }
}

async function addPackageDependency(packageNameAndVersion: string, path: string) {
  const flags: string[] = [
    'ignore-flags',
    'ignore-engines',
    'skip-integrity-check',
    'exact',
    'json',
    'no-progress',
    'silent',
    'no-lockfile',
    'no-bin-links',
    'ignore-optional'
  ];
  const command = `yarn add ${packageNameAndVersion} --${flags.join(' --')}`;
  return executeCommand(command, {cwd: path});
}
