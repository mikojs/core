// @flow

import path from 'path';

import { requireModule, mergeDir } from '@mikojs/utils';
import {
  type mergeDirOptionsType,
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';

type optionsType = {|
  ...$Diff<mergeDirOptionsType, {| watch: mixed |}>,
  dev?: boolean,
|};

type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

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
  { dev, ...options }: optionsType = {},
): middlewareType => {
  const cache = {};

  mergeDir(
    folderPath,
    {
      ...options,
      watch: dev,
    },
    (event: mergeDirEventType, { filePath, extension }: mergeDirDataType) => {
      const pathname = `/${path
        .relative(folderPath, filePath)
        .replace(extension, '')}`;

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
  );

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const middlewareKey = Object.keys(cache).find(
      (pathname: string) => pathname === req.url,
    );

    if (!middlewareKey) return;

    const middlewarePath = cache[middlewareKey];

    if (!middlewarePath) return;

    requireModule(middlewarePath)(req, res);
  };
};
