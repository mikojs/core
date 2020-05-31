// @flow

import { type Readable as ReadableType } from 'stream';

import Multistream from 'multistream';

/**
 */
export default class CustomMultistream extends Multistream {
  /**
   */
  destroy() {
    if (this._current) {
      this._next();
      return;
    }

    this._queue.forEach((stream: ReadableType) => {
      if (stream.destroy) stream.destroy();
    });
    this.emit('close');
  }
}
