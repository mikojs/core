// @flow

import { type ComponentType } from 'react';
import memoizeOne from 'memoize-one';
import uuid from 'uuid/v4';

import Manager from '../Manager';

export const DEFAULT_MANAGER = [
  {
    id: 'manager',
    parentId: null,
    dndType: 'manager',
    type: Manager,
  },
];

export default memoizeOne((components: $ReadOnlyArray<ComponentType<*>>) => [
  ...DEFAULT_MANAGER,
  ...components.map((component: ComponentType<*>) => ({
    id: uuid(),
    parentId: 'manager',
    dndType: 'new-component',
    type: component,
  })),
]);
