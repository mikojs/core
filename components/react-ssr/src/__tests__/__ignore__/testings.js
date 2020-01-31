// @flow

import React, { type Node as NodeType } from 'react';

export const Document = jest
  .fn()
  .mockImplementation(({ children }: {| children: NodeType |}) => children);
export const Main = jest
  .fn()
  .mockImplementation(({ children }: {| children: () => NodeType |}) =>
    children(),
  );
export const Loading = jest.fn();
export const Error = jest.fn();
export const Page = jest.fn().mockReturnValue(<div>Page</div>);
export const chunkName = '/';
export const routesData = [
  {
    exact: true,
    path: [chunkName],
    component: {
      chunkName,
      loader: async () => ({ default: Page }),
    },
  },
];

export default `<div>Page</div>`;
