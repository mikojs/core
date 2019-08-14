// @flow

import { type ComponentType } from 'react';
import memoizeOne from 'memoize-one';
import uuid from 'uuid/v4';

import Manager from '../Manager';

const DEFAULT_MANAGER = [
  {
    id: 'manager',
    parentId: null,
    kind: 'manager',
    type: Manager,
  },
];

export default memoizeOne((components: $ReadOnlyArray<ComponentType<*>>) => [
  ...DEFAULT_MANAGER,
  ...components.map((component: ComponentType<*>) => ({
    id: uuid(),
    parentId: 'manager',
    kind: 'new-component',
    type: component,
  })),
]);
