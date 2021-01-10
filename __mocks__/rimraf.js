// @flow

export default (jest
  .fn()
  .mockImplementation((filePath: string, callback: () => void) =>
    callback(),
  ): JestMockFn<[string, () => void], void>);
