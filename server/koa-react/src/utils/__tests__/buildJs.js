// @flow

import webpack from 'webpack';

import buildJs from '../buildJs';

const config = {
  config: {},
  devMiddleware: {
    stats: false,
  },
};

describe('build js', () => {
  test('error with detail', async () => {
    const error = new Error('error');

    // TODO: flow not support
    // eslint-disable-next-line flowtype/no-weak-types
    (error: any).details = 'error';
    // $FlowFixMe jest mock
    webpack.mockCallbackArguments.mockReturnValue([error]);

    await expect(buildJs(config)).rejects.toBe('error');
  });

  test('error with not detail', async () => {
    const error = new Error('error');

    // $FlowFixMe jest mock
    webpack.mockCallbackArguments.mockReturnValue([error]);

    await expect(buildJs(config)).rejects.toBe(error);
  });

  test('stats has error', async () => {
    const error = new Error('error');

    // $FlowFixMe jest mock
    webpack.mockCallbackArguments.mockReturnValue([
      null,
      {
        hasErrors: () => true,
        toJson: () => ({
          errors: error,
        }),
      },
    ]);

    await expect(buildJs(config)).rejects.toBe(error);
  });
});
