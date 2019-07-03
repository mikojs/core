// @flow

import crypto from 'crypto';

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
  const { type, routers } = getOptions(this) || {};
  let newSource: string = source;

  debugLog({
    type,
    routers,
  });

  switch (type) {
    case 'routers':
      newSource = source
        .replace(/\/\*\* routesData \*\//, routers.routesData)
        .replace(/['"]((?!['"]).|\/)*templates\/Main['"]/, `"${routers.main}"`)
        .replace(
          /['"]((?!['"]).|\/)*templates\/Loading['"]/,
          `"${routers.loading}"`,
        )
        .replace(
          /['"]((?!['"]).|\/)*templates\/Error['"]/,
          `"${routers.error}"`,
        );
      break;

    case 'set-config':
      newSource = source.replace(
        /\/\*\* setConfig \*\//,
        `require('react-hot-loader').setConfig || `,
      );
      break;

    case 'react-hot-loader': {
      const key = `_replace_${crypto
        .createHmac('sha256', source)
        .digest('hex')
        .slice(0, 5)}`;

      if (/module\.exports/.test(source))
        newSource = `${source.replace(/module\.exports/g, `var ${key}`)}

module.exports = require('react-hot-loader/root').hot(${key});`;
      else if (/exports\["default"\]/.test(source))
        newSource = `${source.replace(/exports\["default"\]/g, `var ${key}`)}

exports["default"] = require('react-hot-loader/root').hot(${key});`;
      break;
    }

    default:
      throw new Error('Replace type error');
  }

  debugLog({ source, newSource });
  invariant(newSource !== source, `Replace failed: ${type}`);

  return newSource;
}
