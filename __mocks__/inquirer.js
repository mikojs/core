// @flow

export default ({
  prompt: jest.fn().mockResolvedValue({}),
}: {|
  prompt: JestMockFn<$ReadOnlyArray<void>, Promise<{}>>,
|});
