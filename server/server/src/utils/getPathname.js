// @flow

import path from 'path';

import { type mergeDirDataType } from '@mikojs/utils/lib/mergeDir';

/**
 * @param {string} folderPath - folder path
 * @param {string} basename - basename
 * @param {mergeDirDataType} data - merge dir data
 *
 * @return {string} - pathname
 */
export default (
  folderPath: string,
  basename: ?string,
  { filePath, name, extension }: mergeDirDataType,
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
