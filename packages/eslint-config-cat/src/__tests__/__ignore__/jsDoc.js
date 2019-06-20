// @flow

/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const correctFunction = (argu: string) => 10;

// $expectError jsdoc/newline-after-description
// $expectError jsdoc/require-example
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
 * correctFunction('test');
 *
 * @Param {string} argu - example argu
 * @return {10} - example return
 */
const noParams = (argu: string) => 10;

// $expectError valid-jsdoc
// $expectError jsdoc/require-hyphen-before-param-description
/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu example argu
 */
const noReturns = (argu: string) => 10;

// $expectError jsdoc/check-param-names
// $expectError valid-jsdoc
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
// $expectError valid-jsdoc
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

// $expectError valid-jsdoc
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

// $expectError require-jsdoc
const functionDeclarationRequiredJsDoc = () => 10;

// $expectError require-jsdoc
class classDeclarationRequiredJsDoc {
  test = 'test';

  // $expectError require-jsdoc
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
  // $expectError require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  },
};
