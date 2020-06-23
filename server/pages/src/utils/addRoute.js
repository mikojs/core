// @flow

import { requireModule } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType as serverOptionsType } from '@mikojs/server';
import getPathname from '@mikojs/server/lib/utils/getPathname';
import { type pageComponentType } from '@mikojs/react-ssr';

import { type routesType } from '../index';

export type optionsType = serverOptionsType;

type routeType = $ElementType<$PropertyType<routesType, 'cache'>, number>;

/**
 * @param {routesType} routes - routes
 * @param {string} folderPath - folder path
 * @param {string} basename - basename string
 * @param {mergeDirEventType} event - event name
 * @param {mergeDirDataType} data - event data
 * @param {boolean} isNotFound - is not found page or not
 */
export default (
  routes: routesType,
  folderPath: string,
  basename: ?string,
  event: mergeDirEventType,
  { filePath, name, extension }: mergeDirDataType,
  isNotFound: boolean,
) => {
  const pathname = isNotFound
    ? `/${[basename, '*'].filter(Boolean).join('/')}`
    : getPathname(folderPath, basename, {
        filePath,
        name,
        extension,
      });

  routes.cache = routes.cache.filter(
    ({ path: currentPathname }: routeType) => currentPathname !== pathname,
  );
  routes.filePaths[pathname] = filePath;

  if (event !== 'unlink' || isNotFound)
    routes.cache = [
      ...routes.cache,
      {
        exact: true,
        path: pathname,
        component: {
          chunkName: [
            isNotFound ? 'template' : 'pages',
            pathname.replace(/\*$/, 'notFound').replace(/\/$/, '/index'),
          ].join(''),
          loader: async () => ({
            default: requireModule<pageComponentType<*, *>>(filePath),
          }),
        },
      },
    ].sort((a: routeType, b: routeType): number => {
      const pathALength = [...a.path.replace(/\/\*$/, '').matchAll(/\//g)]
        .length;
      const pathBLength = [...b.path.replace(/\/\*$/, '').matchAll(/\//g)]
        .length;

      if (pathALength !== pathBLength)
        return pathALength > pathBLength ? -1 : 1;

      if (/\*$/.test(a.path)) return 1;

      if (/\*$/.test(b.path)) return -1;

      return !/\/:([^[\]]*)/.test(a.path) ? -1 : 1;
    });
};
