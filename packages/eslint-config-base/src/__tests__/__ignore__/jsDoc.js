// @flow

/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const correctFunction = (argu: string) => 10;

// $expectError jsdoc/no-undefined-types
/**
 * @example
 * undefinedTypes('test');
 *
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
 * @example
 * noParams('test');
 *
 * @Param {string} argu - example argu
 * @return {10} - example return
 */
const noParams = (argu: string) => 10;

// $expectError jsdoc/require-returns
/**
 * @example
 * noReturn('test');
 *
 * @param {number} argu - example argu
 */
const noReturn = (argu: string) => 10;

// $expectError jsdoc/require-hyphen-before-param-description
/**
 * @example
 * noHyphen('test');
 *
 * @param {number} argu example argu
 */
const noHyphen = (argu: string) => {};

// $expectError jsdoc/require-param
// $expectError jsdoc/check-param-names
/**
 * @example
 * checkParamNames();
 *
 * @param {string} Argu - example argu
 */
const checkParamNames = (argu: string) => {};

// $expectError jsdoc/check-types
/**
 * @example
 * checkTypes('test');
 *
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
 * @example
 * requireParamName('test');
 *
 * @param
 * @return {10} - example return
 */
const requireParam = (argu: string) => 10;

// $expectError jsdoc/require-returns-description
// $expectError jsdoc/require-returns-type
/**
 * @example
 * requireReturn('test');
 *
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
   * @example
   * example.showInfo()
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
