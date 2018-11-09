// @flow

import mockChoice from '../mockChoice';

describe.each`
  result
  ${true}
  ${false}
`('mock choice', ({ result }: { result: boolean }) => {
  it(`type: ${result.toString()}`, () => {
    mockChoice(result, () => true, () => false);
  });
});
