import {getLatestVersionsAndSize} from "npm-pkg-utils";
import express = require('express');
import path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const publicRoot: string = argv['publicPath'] || path.join(__dirname, '/public');

const app = express();

app.use('/static', express.static(publicRoot));

app.get('/getLatestPackagesSize', async (req: any, res: any) => {
  const response = await getLatestPackagesSize(req.query.packageName);
  res.send(response);
});

async function getLatestPackagesSize(packageName: string) {
  return await getLatestVersionsAndSize(packageName);
}

const server = app.listen(3000, function() {

});
