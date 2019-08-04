// @flow

import { type Node as NodeType, type ComponentType } from 'react';

type sourceType = {|
  id: string,
  data: {
    type: string | ComponentType<*>,
    props?: {
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
  source: sourceType,
|};
