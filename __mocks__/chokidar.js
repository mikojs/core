// @flow

export default ({
  watch: jest.fn().mockReturnValue({
    on: jest.fn(),
  }),
}: {|
  watch: JestMockFn<
    $ReadOnlyArray<void>,
    {|
      on: JestMockFn<$ReadOnlyArray<void>, void>,
    |},
  >,
|});
