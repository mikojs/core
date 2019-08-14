// @flow

import { type dataType, type kindType } from '../../types';

/**
 * @example
 * findDiff([], [])
 *
 * @param {dataType} first - first data
 * @param {dataType} second - second data
 *
 * @return {object} - type and components to should the diff data
 */
const findDiff = (
  first: dataType,
  second: dataType,
): {
  type: 'add' | 'remove',
  components: $ReadOnlyArray<kindType>,
} =>
  first.length < second.length
    ? {
        ...findDiff(second, first),
        type: 'add',
      }
    : {
        type: 'remove',
        components: first
          .filter(
            ({ id }: $ElementType<dataType, number>) =>
              !second.some(
                ({ id: secondId }: $ElementType<dataType, number>) =>
                  id === secondId,
              ),
          )
          .map(({ kind }: $ElementType<dataType, number>) => kind),
      };

export default findDiff;
