// @flow

const mockLog = jest.fn();

export default (jest.fn().mockReturnValue({
  start: mockLog,
  succeed: mockLog,
  fail: mockLog,
}): JestMockFn<
  $ReadOnlyArray<void>,
  {|
    [string]: JestMockFn<$ReadOnlyArray<void>, void>,
  |},
>);
