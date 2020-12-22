// @flow

import { render } from 'ink-testing-library';

import loggerCache from './utils/loggerCache';

export default ({
  getInstance: loggerCache.getInstance,

  /** */
  reset: () => {
    loggerCache.init({
      render,
      messages: [],
    });
  },
}: {|
  getInstance: $PropertyType<typeof loggerCache, 'getInstance'>,
  reset: () => void,
|});
