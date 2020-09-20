import {Request, Response} from 'express';
import {buildPackageAndGetSizes, PackageInformation} from 'npm-pkg-utils';
import {getVersions} from 'npm-pkg-utils/dist/package-versions';
import express = require('express');
import path = require('path');
const workerpool = require('workerpool');
const os = require('os');

const nbCpus: number = os.cpus().length;
const workersOptions = {
  workerType: 'thread',
  minWorkers: Math.min(os.cpus().length / 2, 4) || 1,
  maxWorkers: nbCpus - 1
};
const pool = workerpool.pool(path.join(__dirname, '/worker.js'), workersOptions);
console.log(`Workers configuration: ${JSON.stringify(workersOptions)}`);

const app = express();

// Serve static files from public folder
app.use('/static', express.static(path.join(__dirname, '/public')));

// Entry point to Get package versions, build and retrieve sizes
app.get('/getLatestPackagesSize', async (req: Request, res: Response) => {
  getLatestPackageAndVersions(req, res, (packageName: string, version: string) => {
    // Build package and get sizes from the main thread
    return buildPackageAndGetSizes(packageName, version);
  });
});

// Entry point to Get package versions, build and retrieve sizes with worker threads
app.get('/getLatestPackagesSizeV2', async (req: Request, res: Response) => {
  getLatestPackageAndVersions(req, res, (packageName: string, version: string) => {
    // Build package and get sizes from the worker threads
    return pool.exec('buildPackageAndGetSizes', [packageName, version]);
  });
});

function getLatestPackageAndVersions(req: Request, res: Response, buildPackageAndGetSizesMethod: (packageName: string, version: string) => Promise<PackageInformation>) {
  const start: Date = new Date();
  const packageName: string = req.query.packageName as string;
  getVersions(packageName).then(async (versions) => {
    const buildStart: Date = new Date();
    const buildPromises = versions.map(
        (version) => {
          return buildPackageAndGetSizesMethod(packageName, version)
          // exceptions are forwarded so that Promise.all doesn't fail for all versions when one package version fails
              .catch(e => e);
        });
    Promise.all(buildPromises).then((response) => {
      const elapsedTime: number = new Date().getTime() - buildStart.getTime();
      console.log(`-- ${packageName} latest versions bundled in ${elapsedTime / 1000}s`);
      res.send(response);
    }).catch((error) => {
      // Errors are forwarded to the frontend which will handle them with a GlobalError state
      res.send(error);
    }).finally(() => {
      const elapsedTime: number = new Date().getTime() - start.getTime();
      console.log(`-- Request for ${packageName} processed in ${elapsedTime / 1000}s`);
    });
  }).catch(error => res.send(error));
}

// Redirect server root to index.html
app.get('/', (req: Request, res: Response) => {
  res.redirect('/static/index.html');
});

const server = app.listen(3000, function() {});
server.setTimeout(600000);
