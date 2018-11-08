// @flow

import mockEnv from '../mockEnv';

describe.each`
  result
  ${true}
  ${false}
`('mock env', ({ result }: { result: boolean }) => {
  it(`type: ${result.toString()}`, () => {
    mockEnv(result, () => true, () => false);
  });
});
