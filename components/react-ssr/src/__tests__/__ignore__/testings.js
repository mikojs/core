// @flow

import React, { type Node as NodeType } from 'react';

import { type errorPropsType } from '../../ErrorCatch';

import { type pageComponentType, type mainComponentType } from 'utils/getPage';

/** @react document component */
export const Document = ({ children }: {| children: NodeType |}) => children;

export const mainRender: JestMockFn<
  [{| children: () => NodeType |}],
  NodeType,
> = jest
  .fn()
  .mockImplementation(({ children }: {| children: () => NodeType |}) =>
    children(),
  );

/** @react main component */
export const Main: mainComponentType = (props: {|
  children: () => NodeType,
|}) => mainRender(props);

Main.getInitialProps = jest.fn();

export const loadingRender: JestMockFn<
  $ReadOnlyArray<void>,
  null,
> = jest.fn().mockReturnValue(null);

/** @react loading component */
export const Loading = () => loadingRender();

export const errorRender: JestMockFn<
  [errorPropsType],
  NodeType,
> = jest
  .fn()
  .mockImplementation(({ error }: errorPropsType) => (
    <div>{error.message}</div>
  ));

/** @react error component */
export const ErrorComponent = (props: errorPropsType) => errorRender(props);

export const pageRender: JestMockFn<
  $ReadOnlyArray<void>,
  NodeType,
> = jest.fn().mockReturnValue(<div>Page</div>);

/** @react page component */
export const Page: pageComponentType = () => pageRender();

Page.getInitialProps = jest.fn();

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
  {
    exact: true,
    path: ['/two'],
    component: {
      chunkName: '/two',
      loader: async () => ({ default: Page }),
    },
  },
];

export default `<div>Page</div>`;
