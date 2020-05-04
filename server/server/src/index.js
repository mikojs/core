// @flow

import path from 'path';

import { requireModule } from '@mikojs/utils';

import build, {
  type optionsType,
  type eventType,
  type dataType,
  type middlewareType,
} from './utils/buildMiddleware';

type cacheType = {
  [string]: string,
};

export const buildMiddleware = build;

/**
 * @example
 * server('/', options)
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (folderPath: string, options: optionsType): middlewareType =>
  buildMiddleware<cacheType>(
    folderPath,
    options,
    {},
    (event: eventType, cache: cacheType, { filePath }: dataType) => {
      const pathname = `/${path.relative(folderPath, filePath)}`;

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
    },
    (cache: cacheType) => (
      req: http.IncomingMessage,
      res: http.ServerResponse,
    ) => {
      const middlewareKey = Object.keys(cache).find(
        (pathname: string) => pathname === req.path,
      );

      if (!middlewareKey) return;

      const middlewarePath = cache[middlewareKey];

      if (!middlewarePath) return;

      requireModule(middlewarePath)(req, res);
    },
  );
