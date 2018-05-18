// @flow

const a = 'value';

/**
 * @example
 * test()
*/
const test = () => {
  // $expectError no-shadow
  const a = 'test';
};
