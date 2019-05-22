// @flow

import { getOptions } from 'loader-utils';

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

    case 'react-hot-loader':
      if (/module\.exports/.test(source))
        newSource = source.replace(
          /module\.exports = ((.|\n)*?);/,
          `module.exports = require('react-hot-loader/root').hot($1);`,
        );
      else if (/exports\["default"\]/.test(source))
        newSource = source.replace(
          /exports\["default"\] = (((?!void 0).|\n)*?);/,
          `exports["default"] = require('react-hot-loader/root').hot($1);`,
        );
      break;

    default:
      throw new Error('Replace type error');
  }

  if (newSource === source) throw new Error(`Replace failed: ${type}`);

  return newSource;
}
