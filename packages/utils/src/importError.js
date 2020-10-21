// @flow

/**
 * @param {string} packageName - package name
 */
const importError = (packageName: string) => {
  throw new Error(
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
};

/**
 * @param {string} packageName - package name
 * @param {Function} requireFunc - require package function
 */
importError.test = (packageName: string, requireFunc: () => mixed) => {
  test(`could not import ${packageName}`, () => {
    expect(() => {
      requireFunc();
    }).toThrow(
      `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
    );
  });
};

export default importError;
