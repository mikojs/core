// @flow

import path from 'path';

import debug from 'debug';

type returnType = {|
  type:
    | 'document'
    | 'main'
    | 'loading'
    | 'error'
    | 'not-found'
    | 'none'
    | 'page',
  relativePath: string,
  filePath: string,
|};

const debugLog = debug('react:getFileType');

/**
 * @example
 * getFileType('/', /\.js$/, '/')
 *
 * @param {string} folderPath - the folder path
 * @param {RegExp} extensions - file extensions
 * @param {string} filePath - the file path
 *
 * @return {returnType} - file type
 */
export default (
  folderPath: string,
  extensions: RegExp,
  filePath: string,
): returnType => {
  const relativePath = path
    .relative(folderPath, filePath)
    .replace(extensions, '');

  debugLog(relativePath);

  if (/^\.templates/.test(relativePath))
    switch (relativePath.replace(/^\.templates\//, '')) {
      case 'Document':
        return {
          type: 'document',
          relativePath,
          filePath,
        };

      case 'Main':
        return {
          type: 'main',
          relativePath,
          filePath,
        };

      case 'Loading':
        return {
          type: 'loading',
          relativePath,
          filePath,
        };

      case 'Error':
        return {
          type: 'error',
          relativePath,
          filePath,
        };

      case 'NotFound':
        return {
          type: 'not-found',
          relativePath,
          filePath,
        };

      default:
        return {
          type: 'none',
          relativePath,
          filePath,
        };
    }

  return {
    type: 'page',
    relativePath,
    filePath,
  };
};
