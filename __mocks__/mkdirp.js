// @flow

const mkdirp = jest.fn().mockResolvedValue();

mkdirp.sync = jest.fn();

export default (mkdirp: {|
  sync: JestMockFn<$ReadOnlyArray<void>, void>,
|});
