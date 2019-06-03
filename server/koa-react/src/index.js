// @flow

import fs from 'fs';
import path from 'path';

import { type Middleware as koaMiddlewareType } from 'koa';
import compose from 'koa-compose';
import { invariant, emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import getData, { type redirectType } from './utils/getData';
import buildJs, {
  type optionsType as buildJsOptionsType,
} from './utils/buildJs';
import buildStatic, {
  type optionsType as buildStaticOptionsType,
} from './utils/buildStatic';
import getConfig from './utils/getConfig';
import server from './utils/server';

export type configType = buildJsOptionsType;

export type optionsType = {|
  dev?: boolean,
  config?: (config: buildJsOptionsType, dev: boolean) => buildJsOptionsType,
  redirect?: redirectType,
  basename?: string,
|};

handleUnhandledRejection();

const urls = {};

export default (
  folderPath: string,
  {
    dev = true,
    config: configFunc = emptyFunction.thatReturnsArgument,
    redirect = emptyFunction.thatReturnsArgument,
    basename,
  }: optionsType = {},
): {|
  buildJs: () => Promise<void>,
  buildStatic: (options: buildStaticOptionsType) => Promise<void>,
  middleware: () => Promise<koaMiddlewareType>,
|} => {
  invariant(
    fs.existsSync(folderPath),
    `\`${path.relative(process.cwd(), folderPath)}\` folder can not be found.`,
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

  urls.clientUrl = `${publicPath}${basenamePath}client.js`;
  urls.commonsUrl = `${publicPath}${basenamePath}commons.js`;

  // TODO: check chunk before building js, static

  return {
    buildJs: async () => {
      const chunkNames = await buildJs(config);

      ['client', 'commons'].forEach((key: string) => {
        const name = `${basenamePath}${key}`;

        if (chunkNames[name])
          urls[`${key}Url`] = `${publicPath}${chunkNames[name]}`;
      });
    },
    buildStatic: (options: buildStaticOptionsType) =>
      buildStatic(data, urls.commonsUrl, options),
    middleware: async () =>
      compose([
        dev
          ? await require('koa-webpack')(config)
          : require('koa-mount')(publicPath, require('koa-static')(urlsPath)),
        server(basename, data, urls),
      ]),
  };
};
