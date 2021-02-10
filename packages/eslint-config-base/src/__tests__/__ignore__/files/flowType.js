// @flow

type correctType = {|
  a: string,
  b: string,
|};

type dupeKeysType = {|
  a: string,
  // $expectError flowtype/no-dupe-keys
  a: string,
|};

// $expectError flowtype/no-mutable-array
type simpleArrayType = Array<string>;

// $expectError flowtype/no-primitive-constructor-types
type testType = Number;

let testUnused: number = 0;
// $expectError flowtype/no-unused-expressions
testUnused + 1;
testUnused += 1;

// $expectError flowtype/no-weak-types
type useAnyType = any;

// $expectError flowtype/no-weak-types
type useObjectType = Object;

// $expectError flowtype/no-weak-types
type useFunctionType = Function;

// $expectError flowtype/type-id-match
type typeIdMatch = string;

// $expectError flowtype/require-variable-type
let requireVariableType = 1;
requireVariableType += 1;

/**
 * @param {any} argu - any
 * @return {any} - any
 */
// $expectError flowtype/require-return-type
const requireReturnType = (argu: string) => {
  const test = `test: ${argu}`;

  return test;
};

/**
 * @param {any} argu - any
 * @return {any} - any
 */
// $expectError flowtype/require-parameter-type
const requireParameterType = (argu): string => {
  const test = `test: ${argu}`;

  return test;
};

/**
 * @param {any} argu - any
 */
const promiseIngore = async (argu: string) => {
  await new Promise((resolve, reject) => {
    if (argu) resolve();
    else reject(new Error('test'));
  });
};

/**
 * @return {string} - 'string'
 */
const expressionsOnly = () => 'string';
