// @flow

/**
 * @example
 * importError('package name')
 *
 * @param {string} packageName - package name
 */
const importError = (packageName: string) => {
  throw new Error(
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
};

importError.test = (packageName: string, requireFunc: () => mixed) => {
  test(`can not import ${packageName}`, () => {
    expect(() => {
      requireFunc();
    }).toThrow(
      `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
    );
  });
};

export default importError;
