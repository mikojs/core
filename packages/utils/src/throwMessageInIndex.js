// @flow

/**
 * @example
 * test('package name', () => require('..'))
 *
 * @param {string} packageName - package name
 * @param {Function} requireFunc - require function
 */
const test = (packageName: string, requireFunc: () => mixed) => {
  it(`can not import ${packageName}`, () => {
    expect(() => {
      requireFunc();
    }).toThrow(
      `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
    );
  });
};

/**
 * @example
 * throwMessageInIndex('package name')
 *
 * @param {string} packageName - package name
 */
const throwMessageInIndex = (packageName: string) => {
  throw new Error(
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
};

throwMessageInIndex.test = test;

export default throwMessageInIndex;
