// @flow

import mockChoice from '../mockChoice';

describe('mock choice', () => {
  test.each`
    expected
    ${true}
    ${false}
  `('expected = $expected', ({ expected }: {| expected: boolean |}) => {
    expect(mockChoice(expected, true, false)).toBe(expected);
  });
});
