// @flow

import url from 'url';

import { parse } from 'query-string';
import { emptyFunction } from 'fbjs';
import debug from 'debug';

import { requireModule } from '@mikojs/utils';

import buildRoutes, {
  type optionsType as buildRoutesOptionsType,
  type loggerType,
} from './utils/buildRoutes';

export type optionsType = {|
  ...buildRoutesOptionsType,
  dev?: boolean,
  logger?: loggerType,
|};

export type middlewareType<
  Req = http.IncomingMessage,
  Res = http.ServerResponse,
> = (req: Req, res: Res) => Promise<void> | void;

const debugLog = debug('server');

/**
 * @param {any} req - nodeJs IncomingMessage
 * @param {any} res - nodeJs ServerResponse
 */
export const notFound = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  res.statusCode = 404;
  res.statusMessage = 'Not found';
  res.write('Not found');
  res.end();
};

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
): middlewareType<> => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    logger = emptyFunction,
    ...buildRoutesOptions
  } = options;
  const routes = buildRoutes(folderPath, dev, logger, buildRoutesOptions);

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { pathname, query } = url.parse(req.url);
    const route = routes.find(pathname);

    debugLog(route);

    if (route) {
      const { getUrlQuery, filePath } = route;

      req.query = {
        ...parse(query || ''),
        ...getUrlQuery(pathname),
      };
      requireModule<middlewareType<>>(filePath)(req, res);
      return;
    }

    notFound(req, res);
  };
};
