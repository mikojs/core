// @flow

import React from 'react';

import { parse } from '../../Provider';

const Example = React.forwardRef<{}, HTMLElement>(
  (
    props: {},
    ref: { current: null | HTMLElement, ... } | ((null | HTMLElement) => mixed),
  ) => <div {...props} ref={ref} />,
);

export default parse([
  {
    id: 'previwer',
    kind: 'previwer',
    type: Example,
  },
  {
    id: 'component',
    parentId: 'previwer',
    kind: 'component',
    type: Example,
    props: {
      children: 'test',
    },
  },
  {
    id: 'component-2',
    parentId: 'previwer',
    kind: 'component',
    type: Example,
    props: {
      children: 'test',
    },
  },
  {
    id: 'preview-component',
    parentId: 'previwer',
    kind: 'preview-component',
    type: Example,
    props: {
      children: 'test',
    },
  },
]);
