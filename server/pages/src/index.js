// @flow

import { type optionsType, type middlewareType } from '@mikojs/server';

import buildRoutes from './utils/buildRoutes';
import buildServer from './utils/buildServer';

type returnType = {|
  middleare: middlewareType<>,
  server: middlewareType<>,
|};

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): returnType => {
  const routes = buildRoutes(folderPath, options);
  const server = buildServer(routes);

  return {
    middleare: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      await server(req, res);
    },
    server,
  };
};
