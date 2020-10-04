// @flow

export const start: JestMockFn<$ReadOnlyArray<void>, void> = jest.fn();
export const func: JestMockFn<
  $ReadOnlyArray<stream$Writable>,
  mixed,
> = jest.fn();
export const end: JestMockFn<$ReadOnlyArray<void>, void> = jest.fn();
