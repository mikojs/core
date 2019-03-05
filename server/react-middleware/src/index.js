// @flow

import fs from 'fs';
import path from 'path';

import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import compose from 'koa-compose';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import getData, { type redirectType } from './utils/getData';
import deleteRequiredCache from './utils/deleteRequiredCache';
import buildJs, { type configType } from './utils/buildJs';
import getConfig from './utils/getConfig';
import server from './utils/server';

handleUnhandledRejection();

export default async ({
  dev = true,
  config: configFunc = emptyFunction.thatReturnsArgument,
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsArgument,
  basename,
}: {
  dev?: boolean,
  config?: (cnofig: {}, dev: boolean) => configType,
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
  const config = configFunc(
    {
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
    },
    dev,
  );

  if (dev) deleteRequiredCache(folderPath);
  else await buildJs(config);

  return compose([
    dev
      ? await require('koa-webpack')(config)
      : async (ctx: koaContextType, next: () => Promise<void>) => {
          await next();
        },
    server(basename, data),
  ]);
};
