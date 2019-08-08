// @flow

import {
  type Node as NodeType,
  type ComponentType,
  type Ref as RefType,
} from 'react';

import typeof RendererType from './Renderer';

export type sourceType = {|
  id: string,
  data: {
    kind: 'manager' | 'previewer' | 'component' | 'new-component',
    type: string | ComponentType<*>,
    props?: {
      ref?: RefType<RendererType>,
      children?: NodeType,
      style?: {},
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
  handler: (kind: string, draggedId: string, targetId: string) => void,
|};
