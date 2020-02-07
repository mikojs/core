// @flow

import { requireModule } from '@mikojs/utils';

/**
 * @example
 * getRouteData('/', '/', getPath)
 *
 * @param {string} relativePath - the relative path
 * @param {string} filePath - the file path
 * @param {Function} getPath - get path function
 *
 * @return {object} - route data
 */
export default (
  relativePath: string,
  filePath: string,
  getPath: (relativePath: string) => string,
) => ({
  exact: true,
  path: [getPath(relativePath)],
  component: {
    chunkName: `pages${getPath(
      relativePath === '*' ? 'notFound' : relativePath,
    )}`,
    loader: async () => ({
      default: requireModule(filePath),
    }),
  },
  filePath,
});
