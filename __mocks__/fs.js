// @flow

// $FlowFixMe FIXME: jest type error
export default (jest.createMockFromModule('fs'): JestMockFn<
  $ReadOnlyArray<void>,
  void,
>);
