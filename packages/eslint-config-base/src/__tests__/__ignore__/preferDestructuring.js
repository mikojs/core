// @flow

const testObj = {
  key: 'value',
};

const testArray = ['1', '2'];

// $expectError prefer-destructuring
const key = testObj.key;

// $expectError prefer-destructuring
const arrayElm = testArray[0];
