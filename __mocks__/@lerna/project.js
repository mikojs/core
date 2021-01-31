// @flow

import path from 'path';

const rootPath = process.cwd();

export const getPackagesSync: JestMockFn<
  $ReadOnlyArray<void>,
  $ReadOnlyArray<{|
    [string]: string,
    bin: {|
      [string]: string,
    |},
    dependencies: {|
      [string]: string,
    |},
  |}>,
> = jest.fn().mockReturnValue([
  {
    name: '@mikojs/core',
    rootPath,
    location: rootPath,
    bin: {
      core: './lib/bin/index.js',
    },
    dependencies: {
      lerna: '^1.0.0',
      '@mikojs/test': '^1.0.0',
    },
  },
  {
    name: '@mikojs/test',
    rootPath,
    location: path.resolve('./test'),
    bin: {
      core: './lib/bin/index.js',
    },
    dependencies: {},
  },
]);

export default (jest.fn(): JestMockFn<$ReadOnlyArray<void>, void>);
