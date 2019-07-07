// @flow

/**
 * @example
 * requireModule('module')
 *
 * @param {string} moduleName - module name
 *
 * @return {any} - module
 */
export default (moduleName: string) =>
  /\.json$/.test(moduleName)
    ? // $FlowFixMe
      require(moduleName)
    : // $FlowFixMe
      require(moduleName).default || require(moduleName);
