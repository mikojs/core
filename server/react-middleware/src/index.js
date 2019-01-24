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

import getRoutesData, { type redirectType } from './utils/getRoutesData';
import getConfig from './utils/getConfig';
import renderPage from './utils/renderPage';

handleUnhandledRejection();

export default async ({
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsArgument,
  dev = true,
  config: configFunc = emptyFunction.thatReturnsArgument,
}: {
  folderPath?: string,
  redirect?: redirectType,
  dev?: boolean,
  config?: (cnofig: {}) => {},
} = {}): Promise<koaMiddlewareType> => {
  if (!fs.existsSync(folderPath))
    throw new Error(
      `\`${path.relative(
        process.cwd(),
        folderPath,
      )}\` folder can not be found.`,
    );

  const routesData = getRoutesData(folderPath, redirect);

  return compose([
    dev
      ? await webpack(
          configFunc({
            config: getConfig(dev, folderPath, routesData),
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
    renderPage(routesData),
  ]);
};
