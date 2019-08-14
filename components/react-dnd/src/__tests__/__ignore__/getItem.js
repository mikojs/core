// @flow

import { type dataType } from '../../types';

/**
 * @example
 * getItem(component)
 *
 * @param {dataType[0]} component - component data
 *
 * @return {object} - transform the dnd type
 */
export default (component: $ElementType<dataType, number>) => ({
  id: component.id,
  type: component.kind,
});
