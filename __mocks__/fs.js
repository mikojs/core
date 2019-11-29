// @flow

export default {
  ...jest.requireActual('fs'),
  existsSync: jest.fn<$ReadOnlyArray<void>, void>(() => true),
  mkdirSync: jest.fn<$ReadOnlyArray<void>, void>(),
  createWriteStream: jest.fn<$ReadOnlyArray<void>, void>(),
};
