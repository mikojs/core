// @flow

import { type Node as NodeType } from 'react';

/** @react control the all page Components */
const Main = ({ children }: {| children: () => NodeType |}) => children();

export default Main;
