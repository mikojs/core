// @flow

/** mock webpack */
class Webpack {
  stats = {};

  err = null;

  /**
   * @example
   * webpack.main({}, () => {})
   *
   * @param {config} config - webpack config
   * @param {Function} callback - trigger callback after rendering
   */
  +main = (config: {||}, callback: (err: ?Error, stats: {}) => {}) => {
    callback(this.err, this.stats);
  };
}

export const webpack = new Webpack();

webpack.main.EnvironmentPlugin = class EnvironmentPlugin {};

export default webpack.main;
