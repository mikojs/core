// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';

type propsType = {|
  source: {|
    id: string,
    data: {|
      type: string | ComponentType<*>,
      props?: {
        children?: NodeType,
      },
    |},
    children?: $ReadOnlyArray<$PropertyType<propsType, 'source'>>,
  |},
|};

const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { type, props = {} },
      children = [],
    },
  }: propsType): NodeType => {
    const newProps = { ...props };

    if (children.length !== 0)
      newProps.children = children.map(
        (child: $PropertyType<propsType, 'source'>) => (
          <Renderer key={child.id} source={child} />
        ),
      );

    return React.createElement(type, newProps);
  },
);

Renderer.displayName = 'Memo(Renderer)';

export default Renderer;
