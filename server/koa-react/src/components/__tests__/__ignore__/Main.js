// @flow

import { type Node as NodeType } from 'react';

export const mainRender = jest.fn<$ReadOnlyArray<void>, void>();

/** @react use to test Main rendering */
const Main = ({ children }: {| children: () => NodeType |}): NodeType => {
  mainRender();

  return children();
};

Main.getInitialProps = jest.fn();

export default Main;
