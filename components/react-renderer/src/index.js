// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';

type sourceType = {|
  id: string,
  data: {|
    type: string | ComponentType<*>,
    props?: {
      children?: NodeType,
    },
    children: $ReadOnlyArray<sourceType>,
  |},
  children: $ReadOnlyArray<sourceType>,
|};

const Renderer = React.memo<{| source: sourceType |}>(
  ({
    source: {
      data: { type, props = {} },
      children,
    },
  }: {
    source: sourceType,
  }) =>
    React.createElement(type, {
      ...props,
      children: !props.children
        ? children.map((child: sourceType) => (
            <Renderer key={child.id} source={child} />
          ))
        : props.children,
    }),
);

export default Renderer;
