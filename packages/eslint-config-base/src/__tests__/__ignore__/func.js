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

// $expectError arrow-body-style
/**
 * @param {string} argu - any
 * @return {'value'} - value
 */
const shouldDirectReturn = (argu: string): string => {
  return 'value';
};

export default correct;
