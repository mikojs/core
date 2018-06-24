// @flow

const correct = {
  key: 'value',
  'need-quoted': 'value',
};

const unnecessarilyQuotedKey = {
  // $expectError quote-props
  'key': 'value',
};
