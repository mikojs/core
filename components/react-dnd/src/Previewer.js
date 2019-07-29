// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import Draggable from 'react-draggable';

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

const Previewer = React.memo<{| source: sourceType |}>(
  ({
    source: {
      data: { type, props = {} },
      children,
    },
  }: {
    source: sourceType,
  }) => (
    <Draggable>
      {React.createElement(type, {
        ...props,
        children: !props.children
          ? children.map((child: sourceType) => (
              <Previewer key={child.id} source={child} />
            ))
          : props.children,
      })}
    </Draggable>
  ),
);

export default Previewer;
