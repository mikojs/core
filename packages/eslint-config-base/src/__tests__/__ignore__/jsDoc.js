// @flow

/**
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const correctFunction = (argu: string) => 10;

// $expectError jsdoc/no-undefined-types
/**
 * @param {UndefinedTypes} argu - example argu
 * @return {10} - example return
 */
const undefinedTypes = (argu: string) => 10;

// $expectError jsdoc/newline-after-description
/**
 * desc
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const noExample = (argu: string) => 10;

// $expectError jsdoc/require-param
// $expectError jsdoc/check-tag-names
/**
 * @Param {string} argu - example argu
 * @return {10} - example return
 */
const noParams = (argu: string) => 10;

// $expectError jsdoc/require-returns
/**
 * @param {number} argu - example argu
 */
const noReturn = (argu: string) => 10;

// $expectError jsdoc/require-hyphen-before-param-description
/**
 * @param {number} argu example argu
 */
const noHyphen = (argu: string) => {};

// $expectError jsdoc/require-param
// $expectError jsdoc/check-param-names
/**
 * @param {string} Argu - example argu
 */
const checkParamNames = (argu: string) => {};

// $expectError jsdoc/check-types
/**
 * @param {Number} argu - example argu
 * @return {10} - example return
 */
const checkTypes = (argu: string) => 10;

// $expectError jsdoc/require-param
// $expectError jsdoc/check-param-names
// $expectError jsdoc/require-param-description
// $expectError jsdoc/require-param-name
// $expectError jsdoc/require-param-type
/**
 * @param
 * @return {10} - example return
 */
const requireParam = (argu: string) => 10;

// $expectError jsdoc/require-returns-description
// $expectError jsdoc/require-returns-type
/**
 * @param {number} argu - example argu
 * @return
 */
const requireReturn = (argu: string) => 10;

// $expectError jsdoc/require-jsdoc
const functionDeclarationRequiredJsDoc = () => 10;

// $expectError jsdoc/require-jsdoc
class classDeclarationRequiredJsDoc {
  test = 'test';

  // $expectError jsdoc/require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  }

  /**
   * Use to test babel/no-invalid-this work.
   * no-invalid-this will fail.
   *
   * @return {string} test
   */
  showInfo = () => this.test;
}

const testObj = {
  // $expectError jsdoc/require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  },
};
