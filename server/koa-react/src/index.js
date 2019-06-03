// @flow

import fs from 'fs';
import path from 'path';

import { type Middleware as koaMiddlewareType } from 'koa';
import compose from 'koa-compose';
import { type WebpackOptions as WebpackOptionsType } from 'webpack';
import { invariant, emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@cat-org/utils';

import getData, { type redirectType, type dataType } from './utils/getData';
import buildJs from './utils/buildJs';
import buildStatic, {
  type optionsType as buildStaticOptionsType,
} from './utils/buildStatic';
import getConfig from './utils/getConfig';
import server from './utils/server';

// TODO: use koa-webpack type
export type configType = {
  config: WebpackOptionsType,
  devMiddleware: {|
    stats?: $PropertyType<
      $NonMaybeType<$PropertyType<WebpackOptionsType, 'devServer'>>,
      'stats',
    >,
  |},
};

export type optionsType = {|
  dev?: boolean,
  config?: (config: configType, dev: boolean) => configType,
  redirect?: redirectType,
  basename?: string,
|};

handleUnhandledRejection();

/** koa-react */
export default class React {
  store: {|
    dev: boolean,
    data: dataType,
    config: configType,
    basename?: string,
    basenamePath: string,
    urls: {|
      clientUrl: string,
      commonsUrl: string,
    |},
  |};

  /**
   * @example
   * new React('folder path')
   *
   * @param {string} folderPath - folder path
   * @param {Object} options - koa-react options
   */
  constructor(
    folderPath: string,
    {
      dev = true,
      config: configFunc = emptyFunction.thatReturnsArgument,
      redirect = emptyFunction.thatReturnsArgument,
      basename,
    }: optionsType = {},
  ) {
    invariant(
      fs.existsSync(folderPath),
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
      config.config.output && config.config.output.publicPath,
      '`{  publicPath }` in `config.config.output` can not be null',
    );

    const { publicPath } = config.config.output;
    const basenamePath = basename ? `${basename.replace(/^\//, '')}/` : '';

    // TODO: check chunk before building js, static

    this.store = {
      dev,
      data,
      config,
      basename,
      basenamePath,
      urls: {
        clientUrl: `${publicPath}${basenamePath}client.js`,
        commonsUrl: `${publicPath}${basenamePath}commons.js`,
      },
    };
  }

  /**
   * @example
   * await react.buildJs()
   */
  buildJs = async () => {
    const { config, basenamePath } = this.store;

    invariant(
      config.config.output && config.config.output.publicPath,
      '`{ publicPath }` in `config.config.output` can not be null',
    );

    const { publicPath } = config.config.output;
    const chunkNames = await buildJs(config);

    ['client', 'commons'].forEach((key: string) => {
      const name = `${basenamePath}${key}`;

      if (chunkNames[name])
        this.store.urls[`${key}Url`] = `${publicPath}${chunkNames[name]}`;
    });
  };

  /**
   * @example
   * await react.buildStatic(options)
   *
   * @param {Object} options - build static options
   */
  buildStatic = async (options: buildStaticOptionsType) => {
    const { data, urls } = this.store;

    await buildStatic(data, urls.commonsUrl, options);
  };

  /**
   * @example
   * await react.middleware()
   *
   * @return {Object} - koa-react middleware
   */
  middleware = async (): Promise<koaMiddlewareType> => {
    const { dev, data, config, basename, urls } = this.store;

    invariant(
      config.config.output &&
        (dev || (config.config.output.path && config.config.output.publicPath)),
      '`{ path, publicPath }` in `config.config.output` can not be null',
    );

    const { path: urlsPath, publicPath } = config.config.output;

    return compose([
      dev
        ? await require('koa-webpack')(config)
        : require('koa-mount')(publicPath, require('koa-static')(urlsPath)),
      server(basename, data, urls),
    ]);
  };
}
