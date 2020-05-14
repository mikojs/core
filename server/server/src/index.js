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

type cacheType = {|
  filePath: string,
  pathname: string,
  regExp: $Call<typeof pathToRegexp, string, $ReadOnlyArray<string>>,
  getUrlQuery: (pathname: string | null) => QueryParametersType,
|};

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
  let cache: $ReadOnlyArray<cacheType> = [];

  mergeDir(
    folderPath,
    {
      ...options,
      watch: dev,
      extensions: /\.js$/,
    },
    (
      event: mergeDirEventType,
      { filePath, name, extension }: mergeDirDataType,
    ) => {
      const relativePath = path.relative(folderPath, filePath);

      debugLog({ event, filePath });

      if (['add', 'change', 'unlink'].includes(event) && logger)
        logger.start(
          chalk`{gray [${event}]} Server updating (${relativePath})`,
        );

      switch (event) {
        case 'init':
        case 'add':
        case 'change':
          const keys = [];
          const dirPath = path.dirname(relativePath);
          const pathname = `/${[
            dirPath === '.' ? '' : dirPath,
            name
              .replace(extension, '')
              .replace(/^index$/, '')
              .replace(/\[([^[\]]*)\]/g, ':$1'),
          ]
            .filter(Boolean)
            .join('/')}`;

          debugLog(pathname);
          cache = [
            ...cache,
            {
              filePath,
              pathname,
              regExp: pathToRegexp(pathname, keys),
              getUrlQuery: (currentPathname: string | null) =>
                keys.length === 0
                  ? {}
                  : match(pathname, { decode: decodeURIComponent })(
                      currentPathname,
                    ).params,
            },
          ].sort((a: cacheType, b: cacheType): number => {
            if (path.dirname(a.pathname) !== path.dirname(b.pathname)) return 0;

            return /\/:([^[\]]*)$/.test(a.pathname) ? 1 : -1;
          });
          break;

        case 'unlink':
          cache = cache.filter(
            ({ filePath: currentFilePath }: cacheType) =>
              currentFilePath !== filePath,
          );
          break;

        default:
          break;
      }

      debugLog({ cache });

      if (['add', 'change', 'unlink'].includes(event) && logger)
        logger.succeed(
          chalk`{gray [${event}]} Server updated (${relativePath})`,
        );
    },
  );

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { pathname, query } = url.parse(req.url);
    const data = cache.find(({ regExp }: cacheType) => regExp.exec(pathname));

    debugLog(data);

    if (data) {
      const { getUrlQuery, filePath } = data;

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
