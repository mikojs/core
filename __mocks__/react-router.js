// @flow

import { emptyFunction } from 'fbjs';

const reactRouter = jest.requireActual('react-router');

reactRouter.withRouter = emptyFunction.thatReturnsArgument;

export default reactRouter;
