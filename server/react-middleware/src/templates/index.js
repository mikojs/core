// @flow

import { emptyFunction } from 'fbjs';

import Document from './Document';

/** Use to store templates */
class Templates {
  getDocument = emptyFunction.thatReturns(Document);
}

export default new Templates();
