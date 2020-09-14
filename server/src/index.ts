import {getLatestVersionsAndSize} from "npm-pkg-utils";
import express = require('express');
import path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const publicRoot: string = argv['publicPath'] || path.join(__dirname, '/public');

const app = express();

app.use('/static', express.static(publicRoot));

app.get('/getLatestPackagesSize', async (req: any, res: any) => {
  try {
    const response = await getLatestPackagesSize(req.query.packageName);
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

async function getLatestPackagesSize(packageName: string) {
  try {
    return await getLatestVersionsAndSize(packageName);
  } catch (e) {
    return e;
  }

}

const server = app.listen(3000, function() {});
