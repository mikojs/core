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

type spaceAfterTypeColonType = {
  // $expectError flowtype/space-after-type-colon
  afterType:string,
  // $expectError flowtype/space-before-type-colon
  beforeType : string,
};

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
const requireReturnType = (argu: string) => argu;

// $expectError flowtype/require-parameter-type
/**
 * @example
 * requireReturnType('test');
 *
 * @param {any} argu - any
 * @return {any} - any
*/
const requireParameterType = (argu): string => argu;
