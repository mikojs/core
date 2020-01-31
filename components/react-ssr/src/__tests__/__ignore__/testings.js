// @flow

import React, { type Node as NodeType } from 'react';

export const Document: JestMockFn<
  [{| children: NodeType |}],
  NodeType,
> = jest
  .fn()
  .mockImplementation(({ children }: {| children: NodeType |}) => children);

export const Main: JestMockFn<
  [{| children: () => NodeType |}],
  NodeType,
> = jest
  .fn()
  .mockImplementation(({ children }: {| children: () => NodeType |}) =>
    children(),
  );

export const Loading = jest.fn<$ReadOnlyArray<void>, NodeType>();
export const ErrorComponent = jest.fn<[{| error: Error |}], NodeType>();
export const Page: JestMockFn<
  $ReadOnlyArray<void>,
  NodeType,
> = jest.fn().mockReturnValue(<div>Page</div>);
export const chunkName = '/';
export const routesData = [
  {
    exact: true,
    path: [chunkName],
    component: {
      chunkName,
      // $FlowFixMe jest mock
      loader: async () => ({ default: Page }),
    },
  },
];

export default `<div>Page</div>`;
