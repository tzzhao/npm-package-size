import {Request, Response} from 'express';
import {getLatestVersionsAndSize} from "npm-pkg-utils";
import express = require('express');
import path = require('path');

const app = express();

app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/', (req: Request, res: Response) => {
  res.redirect('/static/index.html');
});

app.get('/getLatestPackagesSize', async (req: Request, res: Response) => {
  try {
    const response = await getLatestPackagesSize((req.query.packageName as string));
    res.send(response);
  } catch (e) {
    // Errors are forwarded to the frontend which will handle them with a GlobalError state
    res.send(e);
  }
});

async function getLatestPackagesSize(packageName: string) {
  try {
    return await getLatestVersionsAndSize(packageName);
  } catch (e) {
    // Errors are forwarded to the frontend which will handle them with a GlobalError state
    return e;
  }
}

const server = app.listen(3000, function() {});
