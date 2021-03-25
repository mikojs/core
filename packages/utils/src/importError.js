// @flow

import requireModule from './requireModule';

/**
 * @param {string} packageName - package name
 *
 * @return {string} - error message
 */
const getErrorMessage = (packageName: string) =>
  `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`;

/**
 * @param {string} packageName - package name
 */
const importError = (packageName: string) => {
  throw new Error(getErrorMessage(packageName));
};

/**
 * @param {string} packageName - package name
 * @param {string} filePath - file path
 */
importError.test = (packageName: string, filePath: string) => {
  test(`could not import ${packageName}`, () => {
    expect(() => {
      requireModule<*>(filePath);
    }).toThrow(getErrorMessage(packageName));
  });
};

export default importError;
