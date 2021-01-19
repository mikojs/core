// @flow

const rootPath = process.cwd();

export const getPackagesSync: JestMockFn<
  $ReadOnlyArray<void>,
  $ReadOnlyArray<{| [string]: string |}>,
> = jest.fn().mockReturnValue([
  {
    name: '@mikojs/core',
    rootPath,
    location: rootPath,
  },
  {
    name: '@mikojs/test',
    rootPath,
    location: __dirname,
  },
]);

export default (jest.fn(): JestMockFn<$ReadOnlyArray<void>, void>);
