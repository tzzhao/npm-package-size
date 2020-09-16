import {Request, Response} from 'express';
import {getLatestVersionsAndSize} from "npm-pkg-utils";
import express = require('express');
import path = require('path');

const app = express();

// Serve static files from public folder
app.use('/static', express.static(path.join(__dirname, '/public')));

// Entry point to Get package versions, build and retrieve sizes
app.get('/getLatestPackagesSize', async (req: Request, res: Response) => {
  try {
    const response = await getLatestVersionsAndSize((req.query.packageName as string));
    res.send(response);
  } catch (e) {
    // Errors are forwarded to the frontend which will handle them with a GlobalError state
    res.send(e);
  }
});

// Redirect server root to index.html
app.get('/', (req: Request, res: Response) => {
  res.redirect('/static/index.html');
});

const server = app.listen(3000, function() {});
server.setTimeout(600000);
