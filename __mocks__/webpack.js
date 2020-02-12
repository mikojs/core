// @flow

const mockCallbackArguments = jest.fn().mockReturnValue([
  null,
  {
    hasErrors: () => false,
    toJson: () => ({
      assetsByChunkName: {
        commons: '/commons',
        client: '/client',
      },
    }),
  },
]);

const webpack: JestMockFn<
  [{||}, (err: ?Error, stats: {}) => void],
  void,
> = jest
  .fn()
  .mockImplementation(
    (config: {||}, callback: (err: ?Error, stats: {}) => void) => {
      callback(...mockCallbackArguments());
    },
  );

// $FlowFixMe TODO: flow not support
webpack.EnvironmentPlugin = class EnvironmentPlugin {};
// $FlowFixMe TODO: flow not support
webpack.mockCallbackArguments = mockCallbackArguments;

export default webpack;
