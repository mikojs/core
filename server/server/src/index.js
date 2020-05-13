// @flow

import path from 'path';

import chalk from 'chalk';
import { pathToRegexp } from 'path-to-regexp';
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
  const cache = {};

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
          cache[pathname] = filePath;
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
    const middlewareKey = Object.keys(cache).find((pathname: string) =>
      pathToRegexp(pathname).exec(req.url),
    );

    debugLog(middlewareKey && cache[middlewareKey]);

    if (middlewareKey && cache[middlewareKey]) {
      requireModule<middlewareType<>>(cache[middlewareKey])(req, res);
      return;
    }

    res.statusCode = 404;
    res.statusMessage = 'Not found';
    res.write('Not found');
    res.end();
  };
};
