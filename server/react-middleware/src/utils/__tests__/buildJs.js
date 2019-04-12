// @flow

// $FlowFixMe jest mock
import { webpack } from 'webpack';

import buildJs from '../buildJs';

const config = {
  config: {},
  devMiddleware: {
    stats: false,
  },
};

describe('build js', () => {
  test('error with detail', async () => {
    /** test error detail */
    class ErrorDetail extends Error {
      +details: string;

      /**
       * @example
       * new ErrorDetail('error')
       *
       * @param {string} errorMessage - error message
       */
      constructor(errorMessage: string) {
        super(errorMessage);
        this.details = errorMessage;
      }
    }

    webpack.err = new ErrorDetail('error');

    await expect(buildJs(config)).rejects.toBe('error');
  });

  test('error with not detail', async () => {
    webpack.err = new Error('error');

    await expect(buildJs(config)).rejects.toBe(webpack.err);
  });

  test('stats has error', async () => {
    const error = new Error('error');

    webpack.err = null;
    webpack.stats = {
      hasErrors: () => true,
      toJson: () => ({
        errors: error,
      }),
    };

    await expect(buildJs(config)).rejects.toBe(error);
  });
});
