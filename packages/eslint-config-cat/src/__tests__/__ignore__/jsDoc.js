// @flow

/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
 * @return {10} - example return
 */
const correctFunction = (argu: string) => 10;

// $expectError jsdoc/require-example
/**
 */
const noExample = () => {};

// $expectError jsdoc/require-hyphen-before-param-description
/**
 * @example
 * noHyhen()
 *
 * @param {string} argu description
 */
const noHyhen = (argu: string) => {};

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
