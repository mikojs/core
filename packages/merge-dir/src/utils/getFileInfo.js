// @flow

import fs from 'fs';
import path from 'path';

import { invariant } from 'fbjs';

export type fileInfoType = {|
  filePath: string,
  pathname: string,
|};

/**
 * @param {string} folderPath - folder path
 * @param {string} name - file name
 * @param {string} prefix - pathname prefix
 *
 * @return {fileInfoType} - file info
 */
export default (
  folderPath: string,
  name: string,
  prefix: ?string,
): fileInfoType => {
  const filePath = path.resolve(folderPath, name);

  invariant(
    !fs.existsSync(filePath.replace(/\.js$/, '')),
    `You should not use \`folder: ${name.replace(
      /\.js$/,
      '',
    )}\` and \`file: ${name}\` at the same time.`,
  );

  return {
    filePath,
    pathname: [
      prefix,
      name
        .replace(/\.js$/, '')
        .replace(/\/?index$/, '')
        .replace(/\[([^[\]]*)\]/g, ':$1'),
    ]
      .filter(Boolean)
      .join('/')
      .replace(/^([^/])/, '/$1')
      .replace(/^$/, '/'),
  };
};
