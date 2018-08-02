// @flow

/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const correctFunction = (argu: string): number => 10;

// $expectError jsdoc/newline-after-description
// $expectError jsdoc/require-example
/**
 * desc
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const noExample = (argu: string): number => 10;

// $expectError jsdoc/check-tag-names
// $expectError jsdoc/require-param
/**
 * @example
 * correctFunction('test');
 *
 * @Param {string} argu - example argu
 * @return {10} - example return
 */
const noParams = (argu: string): number => 10;

// $expectError jsdoc/require-hyphen-before-param-description
// $expectError valid-jsdoc
/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu example argu
 */
const noReturns = (argu: string): number => 10;

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
const checkTypes = (argu: string): number => 10;

// $expectError jsdoc/check-param-names
// $expectError jsdoc/require-param
// $expectError jsdoc/require-param-description
// $expectError jsdoc/require-param-name
// $expectError jsdoc/require-param-type
// $expectError valid-jsdoc
/**
 * @example
 * requireParamName('test');
 *
 * @param
 * @return {10} - example return
 */
const requireParam = (argu: string): number => 10;

// $expectError jsdoc/require-returns-description
// $expectError jsdoc/require-returns-type
// $expectError valid-jsdoc
/**
 * @example
 * requireReturn('test');
 *
 * @param {number} argu - example argu
 * @return
 */
const requireReturn = (argu: string): number => 10;

// $expectError require-jsdoc
const functionDeclarationRequiredJsDoc = (): number => 10;

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
  showInfo = (): string => this.test;
}

const testObj = {
  // $expectError require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  },
};
