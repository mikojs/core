// @flow

import fs from 'fs';
import path from 'path';

import debug from 'debug';
import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import compose from 'koa-compose';
import { type WebpackOptions as WebpackOptionsType } from 'webpack';
import { invariant, emptyFunction } from 'fbjs';
import outputFileSync from 'output-file-sync';
import address from 'address';

import {
  handleUnhandledRejection,
  requireModule,
  mockChoice,
} from '@mikojs/utils';

import Cache, { type handlerType } from './utils/Cache';
import getConfig from './utils/getConfig';
import buildJs from './utils/buildJs';
import buildStatic, {
  type optionsType as buildStaticOptionsType,
} from './utils/buildStatic';
import server from './utils/server';

import { type propsType } from './components/Root';
import { type wrapperType } from './components/testRender';

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
  handler?: handlerType,
  basename?: string,
  exclude?: RegExp,
|};

handleUnhandledRejection();

const debugLog = debug('react');

/** koa-react */
export default class React {
  store: {|
    cache: Cache,
    dev: boolean,
    config: configType,
    basename?: string,
    basenamePath: string,
    urls: {|
      clientUrl: string,
      commonsUrl: string,
    |},
    urlsFilePath: string | null,
  |};

  /**
   * @example
   * new React('folder path')
   *
   * @param {string} folderPath - folder path
   * @param {optionsType} options - koa-react options
   */
  constructor(
    folderPath: string,
    {
      dev = true,
      config: configFunc = emptyFunction.thatReturnsArgument,
      handler = emptyFunction.thatReturnsArgument,
      basename,
      exclude,
    }: optionsType = {},
  ) {
    invariant(
      fs.existsSync(folderPath),
      `\`${path.relative(
        process.cwd(),
        folderPath,
      )}\` folder can not be found.`,
    );

    debugLog({
      folderPath,
      dev,
      basename,
    });

    const cache = new Cache(folderPath, handler, basename, exclude);
    const config = configFunc(
      {
        config: getConfig(dev, folderPath, basename, exclude, cache),
        devMiddleware: {
          stats: {
            maxModules: 0,
            colors: true,
          },
        },
        hotClient: {
          logLevel: 'warn',
          host: address.ip(),
        },
      },
      dev,
    );

    invariant(
      config.config.output && config.config.output.publicPath,
      '`{  publicPath }` in `config.config.output` can not be null',
    );

    const { path: urlsPath, publicPath } = config.config.output;
    const basenamePath = basename ? `${basename.replace(/^\//, '')}/` : '';

    this.store = {
      cache,
      dev,
      config,
      basename,
      basenamePath,
      urls: {
        clientUrl: `${publicPath}${basenamePath}client.js`,
        commonsUrl: `${publicPath}${basenamePath}commons.js`,
      },
      urlsFilePath: !urlsPath
        ? null
        : path.resolve(urlsPath, basenamePath, 'urls.json'),
    };

    debugLog(this.store);
  }

  /**
   * @example
   * react.update('filePath')
   *
   * @param {string} filePath - file path to watch
   */
  +update = (filePath: string) => {
    this.store.cache.update(filePath);
  };

  /**
   * @example
   * await react.buildJs()
   */
  +buildJs = async () => {
    const { config, basenamePath, urlsFilePath } = this.store;

    // FIXME: avoid to trigger webpack again
    await new Promise(resolve => setTimeout(resolve, 1000));

    invariant(
      config.config.output && config.config.output.publicPath,
      '`{ publicPath }` in `config.config.output` can not be null',
    );

    const { publicPath } = config.config.output;
    const chunkNames = await buildJs(config);

    debugLog(chunkNames);

    ['client', 'commons'].forEach((key: string) => {
      const name = `${basenamePath}${key}`;

      if (chunkNames[name])
        this.store.urls[`${key}Url`] = `${publicPath}${chunkNames[name]}`;
    });

    debugLog(this.store.urls);
    outputFileSync(urlsFilePath, JSON.stringify(this.store.urls));
  };

  /**
   * @example
   * await react.buildStatic(options)
   *
   * @param {buildStaticOptionsType} options - build static options
   */
  +buildStatic = async (options?: buildStaticOptionsType) => {
    const { cache, urls, urlsFilePath } = this.store;

    if (urlsFilePath) {
      try {
        this.store.urls = requireModule(urlsFilePath);
      } catch (e) {
        if (!/Cannot find module/.test(e.message)) throw e;
      }
    }

    await buildStatic(cache, urls.commonsUrl, options);
  };

  /**
   * @example
   * await react.middleware()
   *
   * @return {Function} - koa-react middleware
   */
  +middleware = async (): Promise<koaMiddlewareType> => {
    const { cache, dev, config, basename, urls, urlsFilePath } = this.store;

    invariant(
      config.config.output &&
        (dev || (config.config.output.path && config.config.output.publicPath)),
      '`{ path, publicPath }` in `config.config.output` can not be null',
    );

    const { path: urlsPath, publicPath } = config.config.output;

    try {
      if (!dev && urlsFilePath) this.store.urls = requireModule(urlsFilePath);
    } catch (e) {
      invariant(
        !/Cannot find module/.test(e.message),
        'Use buildJs before running prod mode',
      );

      throw e;
    }

    // FIXME: avoid to trigger webpack again
    await new Promise(resolve => setTimeout(resolve, 1000));

    return compose([
      dev
        ? await mockChoice(
            process.env.NODE_ENV === 'test',
            emptyFunction.thatReturns(
              async (ctx: koaContextType, next: () => Promise<void>) => {
                await next();
              },
            ),
            require('koa-webpack'),
            config,
          )
        : require('koa-mount')(publicPath, require('koa-static')(urlsPath)),
      server(basename, cache, urls),
    ]);
  };

  /**
   * @example
   * await react.render({})
   *
   * @param {string} to - the link to render the first page
   * @param {object} props - the props to render the component
   *
   * @return {wrapperType} - testing wrapper component
   */
  +render = (
    to: string,
    props?: {|
      Main?: $PropertyType<propsType<>, 'Main'>,
      Loading?: $PropertyType<propsType<>, 'Loading'>,
      Error?: $PropertyType<propsType<>, 'Error'>,
      routesData?: $PropertyType<propsType<>, 'routesData'>,
      InitialPage?: $PropertyType<propsType<>, 'InitialPage'>,
      mainInitialProps?: $PropertyType<propsType<>, 'mainInitialProps'>,
      pageInitialProps?: $PropertyType<propsType<>, 'pageInitialProps'>,
    |},
  ): wrapperType => {
    const { cache } = this.store;

    return requireModule(path.resolve(__dirname, './components/testRender'))(
      {
        Main: requireModule(cache.main),
        Loading: requireModule(cache.loading),
        Error: requireModule(cache.error),
        routesData: cache.routesData,
        ...props,
      },
      to,
    );
  };
}
