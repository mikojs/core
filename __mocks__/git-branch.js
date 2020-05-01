// @flow

export default ({
  sync: jest.fn().mockReturnValue(null),
}: {|
  sync: JestMockFn<$ReadOnlyArray<void>, null>,
|});
