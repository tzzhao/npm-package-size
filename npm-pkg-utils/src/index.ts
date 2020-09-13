import {buildPackage, getVersions} from './build-package';

export * from './build-package';
export * from './command-utils';
export * from './interfaces';

export async function getLatestVersionsAndSize(packageName: string) {
  return getVersions(packageName).then(async (versions) => {
    const buildPromises = versions.map(async (version) => {
      try {
        const result = await buildPackage(packageName, version);
        console.log(result);
        return result;
      } catch (e) {
        console.error(e);
        return e;
      }
    });
    return await Promise.all(buildPromises);
  });
}

// const packageName: string = '@angular/core';
//
// getLatestVersionsAndSize(packageName).then(
//     (results) => {
//       console.log('Processed finished');
//     }
// );
