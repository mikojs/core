// @flow

export default ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(),
  lstatSync: jest.fn(),
  symlinkSync: jest.fn(),
}: {
  existsSync: JestMockFn<$ReadOnlyArray<void>, true>,
  mkdirSync: JestMockFn<$ReadOnlyArray<void>, void>,
  createWriteStream: JestMockFn<$ReadOnlyArray<void>, void>,
  lstatSync: JestMockFn<$ReadOnlyArray<void>, void>,
  symlinkSync: JestMockFn<$ReadOnlyArray<void>, void>,
});
