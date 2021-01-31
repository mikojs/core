// @flow

// $FlowFixMe FIXME: jest type error
export default (jest.createMockFromModule('execa'): JestMockFn<
  $ReadOnlyArray<void>,
  void,
>);
