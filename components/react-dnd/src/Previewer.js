// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';
import Draggable from 'react-draggable';

export type sourceType = {|
  id: string,
  data: {|
    type: string | ComponentType<*>,
    props?: {
      children?: NodeType,
    },
  |},
  children: $ReadOnlyArray<sourceType>,
|};

type propsType = {|
  source: sourceType,
|};

/** @react */
const Previewer = React.memo<propsType>(
  ({
    source: {
      data: { type, props = {} },
      children = [],
    },
  }: propsType) => (
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
