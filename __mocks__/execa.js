// @flow

export default (jest.fn().mockResolvedValue({ stdout: '' }): JestMockFn<
  $ReadOnlyArray<void>,
  Promise<{| stdout: string |}>,
>);
