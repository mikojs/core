// @flow

import EventEmitter from 'events';

import { type optionsType, type middlewareType } from '@mikojs/server';
import { type propsType as ssrPropsType } from '@mikojs/react-ssr';

import templates from './templates';

import buildRoutes from './utils/buildRoutes';
import buildWebpack from './utils/buildWebpack';
import buildSSR from './utils/buildSSR';

export type routesType = {|
  events: EventEmitter,
  get: () => $PropertyType<routesType, 'cache'>,
  getTamplate: (name: $Keys<$PropertyType<routesType, 'templates'>>) => string,
  getFilePath: (pathname: string) => string,
  cache: $PropertyType<ssrPropsType, 'routes'>,
  templates: {|
    document: string,
    main: string,
    loading: string,
    error: string,
  |},
  filePaths: {
    [string]: string,
  },
|};

type returnType = {|
  middleware: middlewareType<>,
  webpack: middlewareType<>,
  ssr: middlewareType<>,
|};

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {returnType} - pages object
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): returnType => {
  const routes = {
    events: new EventEmitter(),
    get: () => routes.cache,
    getTamplate: (name: $Keys<$PropertyType<routesType, 'templates'>>) =>
      routes.templates[name],
    getFilePath: (pathname: string) => routes.filePaths[pathname],
    cache: [],
    templates: { ...templates },
    filePaths: {},
  };
  const webpack = buildWebpack(routes, folderPath, options);
  const ssr = buildSSR(routes);

  buildRoutes(routes, folderPath, options);

  return {
    middleware: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      await webpack(req, res);
      await ssr(req, res);
    },
    webpack,
    ssr,
  };
};
