// @flow

import memoizeOne from 'memoize-one';
import uuid from 'uuid/v4';
import { emptyFunction } from 'fbjs';

import { type dataType } from '../types';
import Manager from '../Manager';

export type initializeComponentsType = $ReadOnlyArray<{|
  type: $PropertyType<$ElementType<dataType, number>, 'type'>,
  icon: $PropertyType<$ElementType<dataType, number>, 'icon'>,
|}>;

const DEFAULT_MANAGER = [
  {
    id: 'manager',
    parentId: null,
    kind: 'manager',
    type: Manager,
    icon: emptyFunction,
  },
];

export default memoizeOne((components: initializeComponentsType) => [
  ...DEFAULT_MANAGER,
  ...components.map(
    ({ type, icon }: $ElementType<initializeComponentsType, number>) => ({
      id: uuid(),
      parentId: 'manager',
      kind: 'new-component',
      type,
      icon,
    }),
  ),
]);
