// @flow

import debug from 'debug';

import { requireModule } from '@cat-org/utils';

const debugLog = debug('server:loadModule');

export default <-T>(
  moduleName: string,
  defaultFunc: T,
  ...options: $ReadOnlyArray<mixed>
): T => {
  debugLog(moduleName, options);

  try {
    if (options.length === 0) return requireModule(moduleName);

    return requireModule(moduleName)(...options);
  } catch (e) {
    debugLog(e);

    if (/Cannot find module/.test(e.message)) return defaultFunc;

    throw e;
  }
};
