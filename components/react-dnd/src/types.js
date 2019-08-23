// @flow

import {
  type Node as NodeType,
  type ComponentType,
  type Ref as RefType,
} from 'react';

import typeof RendererType from './Renderer';

export type kindType =
  | 'manager'
  | 'previewer'
  | 'component'
  | 'new-component'
  | 'preview-component';

export type dndItemType = {|
  id: string,
  type: kindType,
|};

export type sourceType = {|
  id: string,
  data: {
    kind: kindType,
    type: string | ComponentType<*>,
    props?: {
      ref?: RefType<RendererType>,
      children?: NodeType,
      style?: {},
      [string]: mixed,
    },
  },
  children: $ReadOnlyArray<sourceType>,
|};

export type dataType = $ReadOnlyArray<
  $PropertyType<sourceType, 'data'> & {
    id: string,
    parentId?: string | null,
  },
>;

export type contextType = {|
  manager: sourceType,
  previewer: sourceType,
  hover: (current: dndItemType, target: dndItemType) => void,
  drop: (current: dndItemType, target: dndItemType) => void,
|};
