// @flow

import debug from 'debug';

import { requireModule } from '@cat-org/utils';

const debugLog = debug('server:loadModule');

/**
 * @example
 * loadMoudle('module name', () => {}, 'argu')
 *
 * @param {string} moduleName - module name
 * @param {any} defaultFunc - default function which is used when module is noe found
 *
 * @return {any} - module
 */
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
