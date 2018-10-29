// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';
import chokidar from 'chokidar';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { root, transformFileOptions, indexFiles } from './__ignore__/constants';

test('verbose: true', () => {
  const mockLog = jest.fn();

  global.console.log = mockLog;
  reset({
    ...transformFileOptions,
    verbose: true,
  });
  babel();

  expect(mockLog).toHaveBeenCalled();
  expect(mockLog).toHaveBeenCalledTimes(2);
  expect(mockLog).toHaveBeenCalledWith(
    `${root.replace(/^\.\//, '')}/index.js -> lib/index.js.flow`,
  );
  expect(mockLog).toHaveBeenCalledWith(
    `${root.replace(
      /^\.\//,
      '',
    )}/justDefinition.js.flow -> lib/justDefinition.js.flow`,
  );
});

describe('watch: true', () => {
  beforeEach(() => {
    reset({
      ...transformFileOptions,
      watch: true,
    });
    babel();
  });

  it('can watch modifying file', () => {
    expect(outputFileSync.destPaths).toEqual(indexFiles);

    chokidar.watchCallback(
      path.resolve(__dirname, './__ignore__/files/justDefinition.js.flow'),
    );
    expect(outputFileSync.destPaths).toEqual([
      ...indexFiles,
      'lib/justDefinition.js.flow',
    ]);
  });

  it('modify file is not .js.flow', () => {
    expect(outputFileSync.destPaths).toEqual(indexFiles);

    chokidar.watchCallback(
      path.resolve(__dirname, './__ignore__/files/index.js'),
    );
    expect(outputFileSync.destPaths).toEqual(indexFiles);
  });
});
