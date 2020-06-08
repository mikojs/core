// @flow

import { type optionsType, type middlewareType } from '@mikojs/server';

import buildRoutes from './utils/buildRoutes';
import buildSSR from './utils/buildSSR';
import buildWebpack from './utils/buildWebpack';

type returnType = {|
  middleware: middlewareType<>,
  ssr: middlewareType<>,
  webpack: middlewareType<>,
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
  const routes = buildRoutes(folderPath, options);
  const ssr = buildSSR(routes);
  const webpack = await buildWebpack();

  return {
    middleware: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      await ssr(req, res);
      await webpack(req, res);
    },
    ssr,
    webpack,
  };
};
