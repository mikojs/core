// @flow

const webpack = jest.fn();

webpack.EnvironmentPlugin = class EnvironmentPlugin {};

export default webpack;
