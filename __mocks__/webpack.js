// @flow

const webpack = jest.fn().mockReturnValue({
  run: jest.fn(),
});

webpack.EnvironmentPlugin = class EnvironmentPlugin {};

export default webpack;
