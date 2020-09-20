const workerpool = require("workerpool");
import {buildPackageAndGetSizes} from "npm-pkg-utils";

workerpool.worker({
  buildPackageAndGetSizes: buildPackageAndGetSizes
});
