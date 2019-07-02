// @flow

export default (moduleName: string) =>
  /\.json$/.test(moduleName)
    ? // $FlowFixMe
      require(moduleName)
    : // $FlowFixMe
      require(moduleName).default || require(moduleName);
