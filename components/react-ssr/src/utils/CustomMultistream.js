// @flow

import Multistream from 'multistream';

/**
 */
export default class CustomMultistream extends Multistream {
  /**
   */
  destroy() {
    if (this._current) this._next();
    else this.emit('close');
  }
}
