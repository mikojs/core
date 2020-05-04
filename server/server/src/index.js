// @flow

import path from 'path';

import buildCache, {
  type optionsType,
  type eventType,
  type dataType,
  type middlewareType,
} from './utils/buildCache';

/**
 * @example
 * server('/', options)
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (folderPath: string, options: optionsType): middlewareType => {
  const cache = {};

  return buildCache(
    folderPath,
    options,
    (event: eventType, { filePath }: dataType) => {
      const pathname = path.relative(folderPath, filePath);

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
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      const middlewareKey = Object.keys(cache).find(
        (pathname: string) => pathname === req.path,
      );

      if (!middlewareKey) return;

      const middleware = cache[middlewareKey];

      if (!middleware) return;

      middleware(req, res);
    },
  );
};
