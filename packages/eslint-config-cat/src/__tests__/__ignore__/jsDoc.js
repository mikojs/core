// @flow

/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
 * @return {10} - example return
*/
const correctFunction = (argu: string): number => 10;

// $expectError jsdoc/require-example
/**
 * @param {number} argu - example argu
 * @return {10} - example return
*/
const noExample = (argu: string): number => 10;

// $expectError jsdoc/require-param
// $expectError valid-jsdoc
/**
 * @example
 * correctFunction('test');
 *
 * @return {10} - example return
*/
const noParams = (argu: string): number => 10;

// $expectError valid-jsdoc
/**
 * @example
 * correctFunction('test');
 *
 * @param {number} argu - example argu
*/
const noReturns = (argu: string): number => 10;

// $expectError require-jsdoc
const functionDeclarationRequiredJsDoc = (): number => 10;

// $expectError require-jsdoc
class classDeclarationRequiredJsDoc {
  // $expectError require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  }
}

const testObj = {
  // $expectError require-jsdoc
  methodDefinitionRequiredJsdoc(): number {
    return 10;
  },
};
