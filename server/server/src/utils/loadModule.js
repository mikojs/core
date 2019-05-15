// @flow

import debug from 'debug';

const debugLog = debug('server:loadModule');

export default <T>(
  moduleName: string,
  defaultFunc: T,
  ...options: $ReadOnlyArray<mixed>
): T => {
  debugLog(moduleName, options);

  try {
    if (options.length === 0)
      return require(moduleName).default || require(moduleName);

    return (require(moduleName).default || require(moduleName))(...options);
  } catch (e) {
    debugLog(e);

    if (/Cannot find module/.test(e.message)) return defaultFunc;

    throw e;
  }
};
