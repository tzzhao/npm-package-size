import {existsSync, promises, writeFileSync} from 'fs';
import * as path from 'path';
import {executeCommand} from './command-utils';
import {PackageInformation} from './interfaces';
import {Timer} from './utils';
import {logDebug, logError} from './utils/logger';
import {PackageError} from './models';
import {compileAndGetSizes} from './webpack-compile';
const rimraf = require('rimraf');

const tmpFolderPath = path.resolve('..','..','tmp');

export async function buildPackageAndGetSizes(packageName: string, packageVersion: string): Promise<PackageInformation> {
  const packageNameAndVersion: string = `${packageName}@${packageVersion}`;

  // Get path to temp folder in which we should build the package
  let timer: Timer = new Timer(`${packageName}@${packageVersion} Build Path and CreateFolders`);
  const [buildPath, buildPathAlreadyExists] = await getBuildPathAndCreateFolders(packageName, packageVersion);
  timer.logEndTime();

  // Run yarn add {packageName} to create the package.json and install the deps in node_modules
  // If build folder already exists, we assume we don't need to add the folder again (TODO: check concurrency case)
  if (!buildPathAlreadyExists) {
    timer.reset(`${packageName}@${packageVersion} Add dependencies`);
    try {
      await addPackageDependency(packageNameAndVersion, buildPath);
    } catch ({error}) {
      // If yarn failed to add the dependencies, we delete the temporary folder
      rimraf(buildPath);
      throw new PackageError({name:'AddDependencyError', message:`Failed to add dependencies for ${packageName}@${packageVersion}`}, packageName, packageVersion);
    } finally {
      timer.logEndTime();
    }
  }

  // Create the entry file that should be provided to webpack
  timer.reset(`${packageName}@${packageVersion} webpack build`);
  const entryFilePath: string = createEntryFile(buildPath, packageName);

  // Webpack bundle + gzip to get the minified and gzipped sizes
  try {
    const response = await compileAndGetSizes(packageName, packageVersion, buildPath, entryFilePath);
    logDebug(response);
    timer.logEndTime();
    return response;
  } catch (error) {
    logError(error);
    timer.logEndTime();
    throw error;
  }
}

async function getBuildPathAndCreateFolders(packageName: string, packageVersion: string): Promise<[string, boolean]> {
  const packages = packageName.split('/');
  packages[packages.length - 1] += '_' +  packageVersion;
  const folders = [tmpFolderPath, ...packages];
  return await folders.reduce(async (accumulator: Promise<[string, boolean]>, currentFolder): Promise<[string, boolean]>=>{
    const [currentFolderPath] = await accumulator;
    const nextFolderPath = currentFolderPath ? path.join(currentFolderPath, currentFolder) : currentFolder;
    const directoryAlreadyExists = !await mkdirIfNeeded(nextFolderPath);
    return [nextFolderPath, directoryAlreadyExists];
  }, new Promise<[string, boolean]>((resolve) => resolve(['', true])));
}

function createEntryFile(buildPath: string, packageName: string): string {
  const entryFilePath = path.join(buildPath, 'index.js');
  const entryFileContent = `const m=require('${packageName}');`;
  writeFileSync(entryFilePath, entryFileContent, 'utf-8');
  return entryFilePath;
}

/**
 * Create a directory if needed. Returns a promise with value true when the folder needs to be created, false if it does
 * already exists
 * @param folderPath
 */
async function mkdirIfNeeded(folderPath: string): Promise<boolean> {
  if (!existsSync(folderPath)) {
    try {
      await promises.mkdir(folderPath);
      logDebug(`${folderPath} was successfully created`);
    } catch(e) {
      logDebug(`Attempt to create ${folderPath} failed`);
      logError(e);
    } finally {
      return true;
    }
  } else {
    logDebug(`${folderPath} already exists`);
    return false;
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
    'ignore-optional',
    'mutex file'
  ];
  const command = `yarn add ${packageNameAndVersion} --${flags.join(' --')}`;
  return executeCommand(command, {cwd: path});
}
