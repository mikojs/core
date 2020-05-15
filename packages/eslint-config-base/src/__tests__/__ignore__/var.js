// @flow

const a = 'value';

const test = () => {
  // $expectError no-shadow
  const a = 'test';
};
