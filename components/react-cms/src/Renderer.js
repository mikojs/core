// @flow

import React from 'react';

import { type sourceType } from './hooks/useSource';
import useDnd from './hooks/useDnd';

type propsType = {
  source: {|
    id: string,
    data: $ElementType<sourceType, number>,
    children: $ReadOnlyArray<$PropertyType<propsType, 'source'>>,
  |},
};

const Renderer = React.memo<propsType>(
  ({
    source: {
      id,
      data: { type, component, getProps },
      children,
    },
  }: propsType) =>
    React.createElement(component, {
      children: (
        children || []
      ).map((child: $PropertyType<propsType, 'source'>) => (
        <Renderer key={child.id} source={child} />
      )),
      ...useDnd({ id, type, component, getProps }),
    }),
);

Renderer.displayName = 'Memo(Renderer)';

export default Renderer;
