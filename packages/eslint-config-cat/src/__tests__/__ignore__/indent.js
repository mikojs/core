// @flow

const correct = '1';

// $expectError indent
  const indentNeedToZero = '1';

// $expectError indent
switch (correct) {
case '1': break;
  default: break;
}
