// @flow

import { render } from 'ink-testing-library';

import { cache } from './index';

type instanceType = $PropertyType<typeof cache, 'instance'>;

cache.render = render;

export default ({
  /**
   * @return {instanceType} - ink instance
   */
  getInstance: async (): Promise<instanceType> => {
    await new Promise(resolve => setTimeout(resolve, 0));

    return cache.instance;
  },

  /** */
  reset: () => {
    cache.instance = null;
  },
}: {|
  getInstance: () => instanceType,
  reset: () => void,
|});
