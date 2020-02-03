// @flow

import React, { type Node as NodeType } from 'react';

import { type errorPropsType } from '../../ErrorCatch';

/** @react document component */
export const Document = ({ children }: {| children: NodeType |}) => children;

/** @react main component */
export const Main = ({ children }: {| children: () => NodeType |}) =>
  children();

/** @react loading component */
export const Loading = () => null;

/** @react error component */
export const ErrorComponent = ({ error }: errorPropsType) => (
  <div>{error.message}</div>
);

export const pageRender: JestMockFn<
  $ReadOnlyArray<void>,
  NodeType,
> = jest.fn().mockReturnValue(<div>Page</div>);

/** @react page component */
export const Page = () => pageRender();

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
