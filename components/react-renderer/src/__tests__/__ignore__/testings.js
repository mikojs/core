// @flow

import React, { type Node as NodeType } from 'react';

export default [
  [
    'default testings',
    [
      {
        id: 1,
        parentId: null,
        type: 'div',
      },
      {
        id: 2,
        parentId: 1,
        type: 'div',
        props: {
          children: 'test',
        },
      },
    ],
    <div>
      <div>test</div>
    </div>,
  ],
  [
    'use props',
    [
      {
        id: 1,
        parentId: null,
        type: 'div',
        props: {
          color: 'red',
        },
      },
      {
        id: 2,
        parentId: 1,
        type: 'div',
        props: {
          color: 'red',
          children: 'test',
        },
      },
    ],
    <div color="red">
      <div color="red">test</div>
    </div>,
  ],
  [
    'use custom Component',
    [
      {
        id: 1,
        parentId: null,
        type: 'div',
      },
      {
        id: 2,
        parentId: 1,
        type: React.memo<{| children: NodeType |}>(
          ({ children }: {| children: NodeType |}) => <a>{children}</a>,
        ),
        props: {
          children: 'test',
        },
      },
    ],
    <div>
      <a>test</a>
    </div>,
  ],
  [
    'block children',
    [
      {
        id: 1,
        parentId: null,
        type: 'div',
      },
      {
        id: 2,
        parentId: 1,
        type: React.memo<{| children: NodeType |}>(
          ({ children }: {| children: NodeType |}) => <a />,
        ),
      },
      {
        id: 3,
        parentId: 2,
        type: 'div',
        props: {
          children: 'test',
        },
      },
    ],
    <div>
      <a />
    </div>,
  ],
];
