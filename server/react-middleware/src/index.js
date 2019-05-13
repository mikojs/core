// @flow

import fs from 'fs';
import path from 'path';

import { type Middleware as koaMiddlewareType } from 'koa';
import compose from 'koa-compose';
import { invariant, emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import getData, { type redirectType } from './utils/getData';
import buildJs, { type configType } from './utils/buildJs';
import prevBuildStatic from './utils/buildStatic';
import getConfig from './utils/getConfig';
import server from './utils/server';

export { buildStatic } from './utils/buildStatic';

export type optionsType = {|
  dev?: boolean,
  config?: (cnofig: configType, dev: boolean) => configType,
  redirect?: redirectType,
  basename?: string,
  useStatic?: boolean,
|};

handleUnhandledRejection();

export default async (
  folderPath: string,
  {
    dev = true,
    config: configFunc = emptyFunction.thatReturnsArgument,
    redirect = emptyFunction.thatReturnsArgument,
    basename,
    useStatic = false,
  }: optionsType = {},
): Promise<koaMiddlewareType> => {
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

  invariant(
    config.config.output &&
      (dev || config.config.output.path) &&
      config.config.output.publicPath,
    '`{ path, publicPath }` in `config.config.output` can not be null',
  );

  const { path: urlsPath, publicPath } = config.config.output;
  const basenamePath = basename ? `${basename.replace(/^\//, '')}/` : '';
  const urls = {
    clientUrl: `${publicPath}${basenamePath}client.js`,
    commonsUrl: `${publicPath}${basenamePath}commons.js`,
  };

  if (!dev) {
    const chunkNames = await buildJs(config);

    ['client', 'commons'].forEach((key: string) => {
      const name = `${basenamePath}${key}`;

      if (chunkNames[name])
        urls[`${key}Url`] = `${publicPath}${chunkNames[name]}`;
    });

    if (useStatic) prevBuildStatic(data, urls.commonsUrl);
  }

  return compose([
    dev
      ? await require('koa-webpack')(config)
      : require('koa-mount')(publicPath, require('koa-static')(urlsPath)),
    server(basename, data, urls),
  ]);
};
