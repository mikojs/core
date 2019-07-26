// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import { type optionsType, type routesDataType } from '@cat-org/koa-react';

import Root from './Root';

/**
 * @example
 * useDnd('chunkName')
 *
 * @param {string} chunkName - chunk name for dnd component
 *
 * @return {Function} - handle @cat-org/koa-react config function
 */
export default (chunkName: string) => ({
  handler = emptyFunction.thatReturnsArgument,
  ...options
}: optionsType = {}): optionsType & {
  handler: $NonMaybeType<$PropertyType<optionsType, 'handler'>>,
} => ({
  ...options,
  handler: (routesData: routesDataType) =>
    handler(
      routesData.some(
        ({ component }: $ElementType<routesDataType, number>) =>
          component.chunkName === chunkName,
      )
        ? routesData
        : [
            ...routesData,
            {
              exact: true,
              path: [`/${chunkName}/*`],
              component: {
                loader: async () => ({
                  default: Root,
                }),
                chunkName,
                filePath: path.resolve(__dirname, './Root'),
              },
            },
          ],
    ),
});
