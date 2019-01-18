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

import pages, { type redirectType } from './pages';
import getConfig from './utils/getConfig';

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

  const { router, entry } = pages.get(folderPath, redirect);

  return compose([
    router.routes(),
    router.allowedMethods(),
    dev
      ? await webpack({
          config: configFunc(getConfig(dev, entry)),
        })
      : // TODO: prod router
        async (ctx: koaContextType, next: () => Promise<void>) => {
          await next();
        },
  ]);
};
