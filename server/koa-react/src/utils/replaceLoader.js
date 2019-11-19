// @flow

import debug from 'debug';
import { invariant } from 'fbjs';
import { getOptions } from 'loader-utils';

const debugLog = debug('react:replaceLoader');

/**
 * @example
 * replaceLoader(source)
 *
 * @param {string} source - source string
 *
 * @return {string} - new string
 */
export default function(source: string): string {
  // eslint-disable-next-line babel/no-invalid-this
  const { type, cacheDir } = getOptions(this) || {};
  let newSource: string = source;

  debugLog({
    type,
    cacheDir,
  });

  switch (type) {
    case 'routers':
      newSource = source.replace(
        /['"]((?!['"]).|\/)*templates\/(Main|Loading|Error|routesData)['"]/g,
        `"${cacheDir}/$2"`,
      );
      break;

    default:
      throw new Error('Replace type error');
  }

  debugLog({ source, newSource });
  invariant(newSource !== source, `Replace failed: ${type}`);

  return newSource;
}
