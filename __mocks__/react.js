// @flow
// TODO: remove after enzyme support react.lazy and react.suspense

// eslint-disable-next-line import/no-extraneous-dependencies
import { type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

const react = jest.requireActual('react');
// TODO component should be ignored
// eslint-disable-next-line require-jsdoc, flowtype/require-return-type
const Suspense = ({ children }: {| children: NodeType |}) => children;
const lazy = emptyFunction.thatReturns(emptyFunction.thatReturnsNull);

react.Suspense = Suspense;
react.lazy = lazy;

export default react;
