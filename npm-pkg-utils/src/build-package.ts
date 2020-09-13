import {existsSync, promises, writeFileSync} from 'fs';
import * as path from 'path';

import {executeCommand} from './command-utils';
import {PackageInformation} from './interfaces/PackageInformation';
import semver = require('semver/preload');
import SemVer = require('semver/classes/semver');
const tmpFolderPath = path.join('..','..','tmp');

import {view} from './package-versions';
import {compile} from './webpack-compile';

export async function getVersions(packageName: string): Promise<string[]>  {
  const versionList: string[] = await new Promise((resolve, reject) => {
    view(packageName, (error: string, version: string, moduleInfo: any) => {
      console.log(moduleInfo);
      resolve(moduleInfo.versions);
    });
  });
  const versionsToPackage: string[] = getLatestVersions(versionList);
  console.log('****************** Versions ***********************');
  console.log(versionsToPackage);

  return versionsToPackage;
}

function getLatestVersions(orderedVersionList: string[]): string[] {
  const nbVersions = orderedVersionList.length;
  let lastMajorVersion = undefined;
  let listVersionsToProcess: string[] = [];

  for (let i = nbVersions - 1; i >= 0; i--) {
    const version = orderedVersionList[i];
    const semVersion: null | SemVer = semver.coerce(version);
    const isPrerelease = version.indexOf('-') > -1;

    // Ignore pre releases
    if (!semVersion || isPrerelease) continue;

    const currentMajorVersion = semVersion.major;

    if (listVersionsToProcess.length < 3) {
      // Take the 3 last published versions
      lastMajorVersion = currentMajorVersion;
      listVersionsToProcess.push(version);
    } else {
      // Look for the latest versimon from the previous major
      if (lastMajorVersion === currentMajorVersion) continue;
      listVersionsToProcess.push(version);
      break;
    }
  }

  return listVersionsToProcess;
}

async function getBuildPathAndCreateFolders(packageName: string, packageVersion: string): Promise<string> {
  const packages = packageName.split('/');
  packages[packages.length - 1] += '_' +  packageVersion;
  const folders = [tmpFolderPath, ...packages];
  return await folders.reduce(async (accumulator: Promise<string>, currentFolder): Promise<string>=>{
    const accValue = await accumulator;
    const nextFolderPath = accValue ? path.join(accValue, currentFolder) : currentFolder;
    await mkdirIfNeeded(nextFolderPath);
    return nextFolderPath;
  }, new Promise<string>((resolve) => resolve('')));
}


export async function buildPackage(packageName: string, packageVersion: string): Promise<PackageInformation> {
  const packageNameAndVersion: string = `${packageName}@${packageVersion}`;
  const buildPath: string = await getBuildPathAndCreateFolders(packageName, packageVersion);

  await addPackageDependency(packageNameAndVersion, buildPath);
  const entryFilePath: string = createEntryFile(buildPath, packageName);
  return await compile(packageName, packageVersion, buildPath, entryFilePath);
}

function createEntryFile(buildPath: string, packageName: string): string {
  const entryFilePath = path.join(buildPath, 'index.js');
  const entryFileContent = `const m=require('${packageName}');`;
  writeFileSync(entryFilePath, entryFileContent, 'utf-8');
  return entryFilePath;
}

async function mkdirIfNeeded(folderPath: string) {
  if (!existsSync(folderPath)) {
    await promises.mkdir(folderPath);
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
