const workerpool = require("workerpool");
import {bundlePackageAndGetSizes, getPackageBundledSize} from 'npm-pkg-utils';

workerpool.worker({
  getPackageBundledSize,
  bundlePackageAndGetSizes: bundlePackageAndGetSizes
});
