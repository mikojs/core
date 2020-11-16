// @flow

type resultType = Promise<{| stdout: string |}> & {|
  cancel: JestMockFn<$ReadOnlyArray<void>, void>,
|};

// $FlowFixMe FIXME could not extend Promise
export default (jest.fn().mockImplementation((): resultType => ({
  ...Promise.resolve({ stdout: '' }),
  cancel: jest.fn(),
})): JestMockFn<$ReadOnlyArray<void>, resultType>);
