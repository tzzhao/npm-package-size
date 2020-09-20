const workerpool = require("workerpool");
import {bundlePackageAndGetSizes} from "npm-pkg-utils";

workerpool.worker({
  bundlePackageAndGetSizes: bundlePackageAndGetSizes
});
