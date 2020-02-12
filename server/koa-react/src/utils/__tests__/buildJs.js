// @flow

import webpack from 'webpack';

import buildJs from '../buildJs';

describe('build js', () => {
  test.each`
    mockResult
    ${['error', null]}
    ${[{ details: 'error' }, null]}
    ${[null, { hasErrors: () => true, toJson: () => ({ errors: 'error' }) }]}
  `(
    'webpack callback result = $mockResult',
    async ({ mockResult }: {| mockResult: $ReadOnlyArray<mixed> |}) => {
      // $FlowFixMe jest mock
      webpack.mockCallbackArguments.mockReturnValue(mockResult);

      await expect(buildJs({ config: {}, devMiddleware: {} })).rejects.toBe(
        'error',
      );
    },
  );
});
