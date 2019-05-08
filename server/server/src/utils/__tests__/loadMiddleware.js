// @flow

import path from 'path';

import ctx from 'koa/lib/context';

import loadMiddleware from '../loadMiddleware';

describe('load middleware', () => {
  test.each`
    moduleName         | options
    ${'module.js'}     | ${[]}
    ${'funcModule.js'} | ${['test']}
  `(
    '$moduleName with $options',
    ({
      moduleName,
      options,
    }: {|
      moduleName: string,
      options: $ReadOnlyArray<string>,
    |}) => {
      expect(
        loadMiddleware(
          path.resolve(__dirname, './__ignore__', moduleName),
          ...options,
        ),
      ).toBe('test');
    },
  );

  test('can not find module', async () => {
    const middleware = loadMiddleware('test.js');
    const mockNext = jest.fn();

    await middleware(ctx, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  test('unknown error', () => {
    expect(() =>
      loadMiddleware(path.resolve(__dirname, './__ignore__/errorModule.js')),
    ).toThrow('error');
  });
});
