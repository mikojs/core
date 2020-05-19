// @flow

import path from 'path';

import chalk from 'chalk';
import { pathToRegexp, match } from 'path-to-regexp';
import { type QueryParameters as QueryParametersType } from 'query-string';
import debug from 'debug';

import { mergeDir } from '@mikojs/utils';
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

type routeType = {|
  filePath: string,
  pathname: string,
  regExp: $Call<typeof pathToRegexp, string, $ReadOnlyArray<string>>,
  getUrlQuery: (pathname: ?string) => QueryParametersType,
|};

type cacheType = {|
  routes: $ReadOnlyArray<routeType>,
  find: (pathname: ?string) => ?routeType,
|};

const debugLog = debug('server:buildRoutes');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {cacheType} - routes cache
 */
export default (
  folderPath: string,
  { dev, logger, ...options }: optionsType,
): cacheType => {
  const cache: cacheType = {
    routes: [],
    find: (pathname: ?string) =>
      cache.routes.find(({ regExp }: routeType) => regExp.exec(pathname)),
  };

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
      const shouldLog = ['add', 'change', 'unlink'].includes(event);

      debugLog({ event, filePath });

      if (shouldLog && logger)
        logger.start(
          chalk`{gray [${event}]} Server updating (${relativePath})`,
        );

      if (['init', 'add', 'change', 'unlink'].includes(event)) {
        cache.routes = cache.routes.filter(
          ({ filePath: currentFilePath }: routeType) =>
            currentFilePath !== filePath,
        );

        if (event !== 'unlink') {
          const keys = [];
          const pathname = `/${[
            path.dirname(relativePath).replace(/^\./, ''),
            name
              .replace(extension, '')
              .replace(/^index$/, '')
              .replace(/\[([^[\]]*)\]/g, ':$1'),
          ]
            .filter(Boolean)
            .join('/')}`;

          debugLog(pathname);
          cache.routes = [
            ...cache.routes,
            {
              filePath,
              pathname,
              regExp: pathToRegexp(pathname, keys),
              getUrlQuery: (currentPathname: ?string) =>
                keys.length === 0
                  ? {}
                  : match(pathname, { decode: decodeURIComponent })(
                      currentPathname,
                    ).params,
            },
          ].sort((a: routeType, b: routeType): number => {
            if (path.dirname(a.pathname) !== path.dirname(b.pathname)) return 0;

            return /\/:([^[\]]*)$/.test(a.pathname) ? 1 : -1;
          });
        }
      }

      debugLog(cache);

      if (shouldLog && logger)
        logger.succeed(
          chalk`{gray [${event}]} Server updated (${relativePath})`,
        );
    },
  );

  return cache;
};
