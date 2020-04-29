// @flow

export default (jest.fn().mockReturnValue({ width: 0, height: 0 }): JestMockFn<
  $ReadOnlyArray<void>,
  {| width: number, height: number |},
>);
