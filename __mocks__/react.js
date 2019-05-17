// @flow
// TODO: remove after enzyme support react.lazy and react.suspense

import { emptyFunction } from 'fbjs';

const react = jest.requireActual('react');
const lazy = emptyFunction.thatReturns(emptyFunction.thatReturnsNull);

react.lazy = lazy;

export default react;
