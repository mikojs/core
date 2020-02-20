// @flow

import { requireModule } from '@mikojs/utils';

import { type cacheType } from './buildCache';

/**
 * @example
 * getRouteData('/', '/', getPath)
 *
 * @param {string} basename - the basename
 * @param {string} relativePath - the relative path
 * @param {string} filePath - the file path
 *
 * @return {object} - route data
 */
export default (
  basename: ?string,
  relativePath: string,
  filePath: string,
): $ElementType<$PropertyType<cacheType, 'routesData'>, number> => {
  const routePath = `${basename || ''}${relativePath
    .replace(/(\/?index)?$/, '')
    .replace(/^/, '/')
    .replace(/\/\[([^[\]]*)\]/g, '/:$1')}`;

  return {
    exact: true,
    path: [routePath],
    component: {
      chunkName: `pages${routePath.replace(/\*$/, 'notFound')}`,
      loader: async () => ({
        default: requireModule(filePath),
      }),
    },
    filePath,
  };
};
