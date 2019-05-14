// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import loadModule from '../loadModule';

describe('load module', () => {
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
        loadModule(
          path.resolve(__dirname, './__ignore__', moduleName),
          emptyFunction,
          ...options,
        ),
      ).toBe('test');
    },
  );

  test('can not find module', () => {
    const mockNext = jest.fn();

    loadModule('test.js', mockNext)('test');

    expect(mockNext).toHaveBeenCalled();
  });

  test('unknown error', () => {
    expect(() =>
      loadModule(path.resolve(__dirname, './__ignore__/errorModule.js')),
    ).toThrow('error');
  });
});
