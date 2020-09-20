import * as npm from 'npm';
import {PackageError} from './models';
import {Timer} from './utils';
import semver = require('semver/preload');
import SemVer = require('semver/classes/semver');
import {logDebug, logInfo} from './utils/logger';

/**
 * Get all published versions of a package
 * @param packageName
 */
export async function getVersions(packageName: string): Promise<string[]>  {
  logDebug(`npm view ${packageName} --versions -- START`);
  const timer: Timer = new Timer(`npm view ${packageName}`);
  const versionList: string[] = await new Promise((resolve, reject) => {
    view(packageName, (error: PackageError, version: string, moduleInfo: any) => {
      timer.logEndTime();
      if (error) return reject(error);
      logInfo(moduleInfo);
      resolve(moduleInfo.versions);
    });
  });
  const versionsToPackage: string[] = getLatestVersions(versionList);
  logDebug('****************** Versions ***********************');
  logDebug(versionsToPackage);

  return versionsToPackage;
}

/**
 * Get the last 3 non pre-release versions of a package as well as the previous major version
 * @param orderedVersionList
 */
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

/**
 * Programmatically call npm view.
 * Adaptation of https://www.npmjs.com/package/npmview which was using a very old version of npm
 * @param name
 * @param cb
 */
export function view(name: string, cb: Function) {
  if (!name.length)
    return new PackageError({message: 'Package name should not be an empty string.', name: 'EmptyPackageNameError'}, name, '');

  npm.load({ loglevel: 'silent' }, function (err) {

    if (err) return cb(err);

    const silent = true;
    npm.commands.view([name], silent, function (err, data) {
      if (err) return cb(new PackageError({message: err.message, name: `NpmViewError`}, name, ''));
      if (!data) return cb(new PackageError({message: 'Npm package not found', name: 'NpmPackageNotError'}, name, ''));

      for (const p in data) {
        if (!data.hasOwnProperty(p) ||!semver.valid(p))
          continue;
        return cb(null, p, data[p]);
      }
      return cb(new PackageError({message: `Bad data received: ${JSON.stringify(data)}`, name: 'NpmViewBadDataError'}, name, ''));
    });
  });
}
