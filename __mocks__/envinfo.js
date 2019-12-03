// @flow

export default ({
  run: jest.fn().mockResolvedValue(
    JSON.stringify({
      Binaries: {
        Node: {
          version: 'node version',
        },
        Yarn: {
          version: 'yarn version',
        },
        npm: {
          version: 'npm version',
        },
      },
    }),
  ),
}: {|
  run: JestMockFn<$ReadOnlyArray<void>, Promise<string>>,
|});
