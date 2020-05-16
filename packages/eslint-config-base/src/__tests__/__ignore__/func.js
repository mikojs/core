// @flow

/**
 * @param {string} argu - any
 * @return {'value'} - value
 */
export const correct = (argu: string) => 'value';

/**
 * @param {string} argu - any
 * @return {'test'} - value
 */
const correctNotDirectReturn = (argu: string): string => {
  const a = 'test';

  return a;
};

/**
 * @param {string} argu - any
 * @return {'value'} - value
 */
// $expectError arrow-body-style
const shouldDirectReturn = (argu: string): string => {
  return 'value';
};

export default correct;
