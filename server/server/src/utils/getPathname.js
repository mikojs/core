// @flow

import path from 'path';

import { type dirDataType } from './parseDir';

/**
 * @param {string} folderPath - folder path
 * @param {string} basename - basename
 * @param {dirDataType} data - merge dir data
 *
 * @return {string} - pathname
 */
export default (
  folderPath: string,
  basename: ?string,
  { filePath, name, extension }: dirDataType,
) =>
  `/${[
    basename,
    path.dirname(path.relative(folderPath, filePath)).replace(/^\./, ''),
    name
      .replace(extension, '')
      .replace(/^index$/, '')
      .replace(/\[([^[\]]*)\]/g, ':$1'),
  ]
    .filter(Boolean)
    .join('/')}`;
