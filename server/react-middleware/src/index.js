// @flow

import fs from 'fs';
import path from 'path';

import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import compose from 'koa-compose';
import webpack from 'koa-webpack';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import getData, { type redirectType } from './utils/getData';
import getConfig from './utils/getConfig';
import deleteRequiredCache from './utils/deleteRequiredCache';
import renderPage from './utils/renderPage';

handleUnhandledRejection();

export default async ({
  dev = true,
  config: configFunc = emptyFunction.thatReturnsArgument,
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsArgument,
  basename,
}: {
  dev?: boolean,
  config?: (cnofig: {}) => {},
  folderPath?: string,
  redirect?: redirectType,
  basename?: string,
} = {}): Promise<koaMiddlewareType> => {
  if (!fs.existsSync(folderPath))
    throw new Error(
      `\`${path.relative(
        process.cwd(),
        folderPath,
      )}\` folder can not be found.`,
    );

  const data = getData(folderPath, redirect, basename);

  if (dev) deleteRequiredCache(folderPath);

  return compose([
    dev
      ? await webpack(
          configFunc({
            config: getConfig(dev, folderPath, basename, data),
            devMiddleware: {
              stats: {
                maxModules: 0,
                colors: true,
              },
            },
            hotClient: {
              logLevel: 'warn',
            },
          }),
        )
      : async (ctx: koaContextType, next: () => Promise<void>) => {
          await next();
        },
    renderPage(basename, data),
  ]);
};
