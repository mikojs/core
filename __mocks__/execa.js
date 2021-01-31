// @flow

type resultType = Promise<{| stdout: string |}> & {|
  cancel: JestMockFn<$ReadOnlyArray<void>, void>,
|};

const execa = jest.requireActual('execa');
const execaMock = jest.fn().mockReturnValue({
  ...Promise.resolve({ stdout: '' }),
  cancel: jest.fn(),
});

Object.keys(execa).forEach((key: string) => {
  execaMock[key] = execa[key];
});

export default (execaMock: JestMockFn<$ReadOnlyArray<void>, resultType>);
