import * as expressi from 'express';
// import React from 'react';
import path from 'path';
import * as express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import paths from '../../../config/paths';
import errorHandler from './middleware/errorHandler';
import serverRenderer from './middleware/serverRenderer';

export default function setupExpressApp(app: express.Application) {
  require('dotenv').config();

  // Use Nginx or Apache to serve static assets in production or remove the if() around the following
  // lines to use the express.static middleware to serve assets for production (not recommended!)
  if (process.env.NODE_ENV === 'development') {
    app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)));
  }

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const manifestPath = path.join(paths.clientBuild, paths.publicPath);

  app.use(
    manifestHelpers({
      manifestPath: `${manifestPath}/manifest.json`,
    })
  );

  app.use(serverRenderer());

  app.use(errorHandler);

  app.listen(process.env.PORT || 8500, () => {
    console.log(
      `[${new Date().toISOString()}]`,
      chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
    );
  });

  return app;
}
