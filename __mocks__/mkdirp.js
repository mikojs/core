// @flow

// $FlowFixMe FIXME: jest type error
export default (jest.createMockFromModule('mkdirp'): JestMockFn<
  $ReadOnlyArray<void>,
  void,
>);
