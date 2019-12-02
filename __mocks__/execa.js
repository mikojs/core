// @flow

const mockResult: Promise<{ stdout: string }> & {
  stdout?: {},
  stderr?: {},
} = Promise.resolve({ stdout: '' });

mockResult.stdout = {
  pipe: jest.fn(),
};

mockResult.stderr = {
  pipe: jest.fn(),
};

export default (jest.fn().mockReturnValue(mockResult): JestMockFn<
  $ReadOnlyArray<void>,
  typeof mockResult,
>);
