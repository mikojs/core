// @flow

type correctType = {
  a: string,
  b: string,
};

// $expectError flowtype/no-dupe-keys
type dupeKeysType = {
  a: string,
  a: string,
};

// $expectError flowtype/no-mutable-array
type simpleArrayType = Array<string>;

// $expectError flowtype/no-primitive-constructor-types
type testType = Number;

let testUnused: number = 0;
// $expectError flowtype/no-unused-expressions
testUnused + 1;

// $expectError flowtype/no-weak-types
type useAnyType = any;

// $expectError flowtype/no-weak-types
type useObjectType = Object;

// $expectError flowtype/no-weak-types
type useFunctionType = Function;

// $expectError flowtype/type-id-match
type typeIdMatch = string;

// $expectError flowtype/require-variable-type
let requireVariableType = 'test';

// $expectError flowtype/require-return-type
/**
 * @example
 * requireReturnType('test');
 *
 * @param {any} argu - any
 * @return {any} - any
 */
const requireReturnType = (argu: string) => {
  const test = `test: ${argu}`;

  return test;
};

// $expectError flowtype/require-parameter-type
/**
 * @example
 * requireReturnType('test');
 *
 * @param {any} argu - any
 * @return {any} - any
 */
const requireParameterType = (argu): string => {
  const test = `test: ${argu}`;

  return test;
};

/**
 * @example
 * requireReturnType('test');
 *
 * @param {any} argu - any
 * @return {Promise} - any
 */
const promiseIngore = async (argu: string): Promise<void> => {
  await new Promise((resolve, reject) => {
    if (argu) resolve();
    else reject();
  });
};

/**
 * @example
 * expressionsOnly()
 *
 * @return {string} - 'string'
 */
const expressionsOnly = () => 'string';
