// @flow

const rootPath = process.cwd();

export const getPackagesSync: JestMockFn<
  $ReadOnlyArray<void>,
  $ReadOnlyArray<{|
    [string]: string,
    dependencies?: {|
      [string]: string,
    |},
  |}>,
> = jest.fn().mockReturnValue([
  {
    name: '@mikojs/core',
    rootPath,
    location: rootPath,
    dependencies: {
      lerna: '^1.0.0',
      '@mikojs/test': '^1.0.0',
    },
  },
  {
    name: '@mikojs/test',
    rootPath,
    location: __dirname,
  },
]);

export default (jest.fn(): JestMockFn<$ReadOnlyArray<void>, void>);
