// @flow

import { type optionsType, type middlewareType } from '@mikojs/server';
import { type propsType as ssrPropsType } from '@mikojs/react-ssr';

import templates from './templates';

import buildRoutes from './utils/buildRoutes';
import buildWebpack from './utils/buildWebpack';
import buildSSR from './utils/buildSSR';

export type routesType = {|
  get: () => $PropertyType<routesType, 'cache'>,
  getTamplate: (name: $Keys<$PropertyType<routesType, 'templates'>>) => string,
  cache: $PropertyType<ssrPropsType, 'routes'>,
  templates: {|
    document: string,
    main: string,
    loading: string,
    error: string,
  |},
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
export default async (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): Promise<returnType> => {
  const routes = {
    get: () => routes.cache,
    getTamplate: (name: $Keys<$PropertyType<routesType, 'templates'>>) =>
      routes.templates[name],
    cache: [],
    templates: { ...templates },
  };
  const webpack = await buildWebpack();
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
