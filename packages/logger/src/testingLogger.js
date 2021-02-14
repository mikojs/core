// @flow

import { render } from 'ink-testing-library';

import { cache } from './index';

cache.render = render;

export default ({
  /**
   * @return {any} - ink instance
   */
  getInstance: () => cache.instance,

  /** */
  reset: () => {
    cache.instance = null;
  },
}: {|
  getInstance: () => $PropertyType<typeof cache, 'instance'>,
  reset: () => void,
|});
