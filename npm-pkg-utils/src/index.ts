import {buildPackageAndGetSizes} from './build-package';
import {getVersions} from './package-versions';

export * from './build-package';
export * from './command-utils';
export * from './interfaces';
export * from './models';

export async function getLatestVersionsAndSize(packageName: string) {
    return await getVersions(packageName).then(async (versions) => {
      const buildPromises = versions.map(async (version) => {
        try {
          const result = await buildPackageAndGetSizes(packageName, version);
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
