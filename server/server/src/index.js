// @flow

import path from 'path';
import url from 'url';

import chalk from 'chalk';
import { pathToRegexp, match } from 'path-to-regexp';
import {
  parse,
  type QueryParameters as QueryParametersType,
} from 'query-string';
import debug from 'debug';

import { requireModule, mergeDir } from '@mikojs/utils';
import {
  type mergeDirOptionsType,
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import typeof createLoggerType from '@mikojs/utils/lib/createLogger';

export type optionsType = {|
  ...$Diff<mergeDirOptionsType, {| watch: mixed |}>,
  dev?: boolean,
  logger?: $Call<createLoggerType, string>,
|};

export type middlewareType<
  Req = http.IncomingMessage,
  Res = http.ServerResponse,
> = (req: Req, res: Res) => void;

const debugLog = debug('server');

/**
 * @example
 * server('/', options)
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (
  folderPath: string,
  { dev, logger, ...options }: optionsType = {},
): middlewareType<> => {
  const cache: {
    [string]: {
      filePath: string,
      regExp: $Call<typeof pathToRegexp, string, $ReadOnlyArray<string>>,
      getUrlQuery: (pathname: string | null) => QueryParametersType,
    },
  } = {};

  mergeDir(
    folderPath,
    {
      ...options,
      watch: dev,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const pathname = `/${[
        path.relative(folderPath, path.dirname(filePath)),
        name
          .replace(extension, '')
          .replace(/^index$/, '')
          .replace(/\[([^[\]]*)\]/g, ':$1'),
      ]
        .filter(Boolean)
        .join('/')}`;

      debugLog({ event, filePath, pathname });

      if (['add', 'change', 'unlink'].includes(event) && logger)
        logger.start(chalk`{gray [${event}]} Server updating`);

      switch (event) {
        case 'init':
        case 'add':
        case 'change':
          const keys = [];

          cache[pathname] = {
            filePath,
            regExp: pathToRegexp(pathname, keys),
            getUrlQuery: (currentPathname: string | null) =>
              keys.length === 0
                ? {}
                : match(pathname, { decode: decodeURIComponent })(
                    currentPathname,
                  ).params,
          };
          break;

        case 'unlink':
          delete cache[pathname];
          break;

        default:
          break;
      }

      debugLog({ cache });

      if (['add', 'change', 'unlink'].includes(event) && logger)
        logger.succeed(chalk`{gray [${event}]} Server updated`);
    },
  );

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { pathname, query } = url.parse(req.url);
    const cacheKey = Object.keys(cache).find((key: string) =>
      cache[key].regExp.exec(pathname),
    );

    debugLog(cacheKey && cache[cacheKey]);

    if (cacheKey && cache[cacheKey]) {
      const { getUrlQuery, filePath } = cache[cacheKey];

      req.query = {
        ...parse(query || ''),
        ...getUrlQuery(pathname),
      };
      requireModule<middlewareType<>>(filePath)(req, res);
      return;
    }

    res.statusCode = 404;
    res.statusMessage = 'Not found';
    res.write('Not found');
    res.end();
  };
};
