import {getLatestVersionsAndSize} from "npm-pkg-utils";
import express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/getLatestPackagesSize', async (req: any, res: any) => {
  const response = await getLatestPackagesSize(req.query.packageName);
  res.send(response);
});

async function getLatestPackagesSize(packageName: string) {
  return await getLatestVersionsAndSize(packageName);
}

const server = app.listen(3000, function() {

});
