// @flow

import { type Node as NodeType } from 'react';

// TODO component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
const Main = ({ children }: {| children: () => NodeType |}) => children();

export default Main;
