// @flow

import { type EmptyFunctionType } from 'fbjs/lib/emptyFunction';

import mergeDir, { type fileDataType } from '../../index';

const cache = {};

/**
 * @param {string} folderPath - folder path
 *
 * @return {Function} - cache function
 */
export default ((
  folderPath: string,
): $PropertyType<EmptyFunctionType, 'thatReturnsArgument'> => {
  const cacheFilePath = mergeDir.set(
    folderPath,
    ({ filePath, pathname }: fileDataType): string => {
      cache[pathname] = filePath;

      return `const requireModule = require('@mikojs/utils/lib/requireModule');

const cache = ${JSON.stringify(cache)};

module.exports = pathname => {
  const cacheKey = Object.keys(cache).find(key => key === pathname);

  if (cacheKey)
    return requireModule(cache[cacheKey])(pathname);
};`;
    },
  );

  return <T>(filePath: T) => mergeDir.get(cacheFilePath)(filePath);
}: (
  folderPath: string,
) => $PropertyType<EmptyFunctionType, 'thatReturnsArgument'>);
