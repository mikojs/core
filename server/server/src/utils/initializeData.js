// @flow

import path from 'path';

import { type dirDataType } from './parseDir';

type optionsType = {|
  ...$Diff<dirDataType, {| pathname: string |}>,
  folderPath: string,
  basename: ?string,
|};

/**
 * @param {optionsType} options - optoins
 *
 * @return {dirDataType} - dir data
 */
export default ({
  folderPath,
  basename,
  filePath,
  name,
  extension,
}: optionsType): dirDataType => ({
  filePath,
  name,
  extension,
  pathname: `/${[
    basename,
    path.dirname(path.relative(folderPath, filePath)).replace(/^\./, ''),
    name
      .replace(extension, '')
      .replace(/^index$/, '')
      .replace(/\[([^[\]]*)\]/g, ':$1'),
  ]
    .filter(Boolean)
    .join('/')}`,
});
