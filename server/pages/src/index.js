// @flow

import { type optionsType, type middlewareType } from '@mikojs/server';

import buildRoutes from './utils/buildRoutes';
import buildWebpack from './utils/buildWebpack';
import buildSSR from './utils/buildSSR';

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
  const routes = buildRoutes(folderPath, options);
  const webpack = await buildWebpack();
  const ssr = buildSSR(routes);

  return {
    middleware: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      await webpack(req, res);
      await ssr(req, res);
    },
    webpack,
    ssr,
  };
};
