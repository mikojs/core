// @flow

import { outputFileSync } from 'output-file-sync';

import circleci from '../circleci';

import ctx from './__ignore__/ctx';

circleci.ctx = ctx;

test.each`
  useNpm
  ${false}
  ${true}
`('circleci with useNpm = $useNpm', async ({ useNpm }: { useNpm: boolean }) => {
  outputFileSync.contents = [];

  expect(
    await circleci.end({
      ...ctx,
      useNpm,
    }),
  ).toBeUndefined();
  (useNpm
    ? expect(outputFileSync.contents[0])
    : expect(outputFileSync.contents[0]).not
  ).toMatch(new RegExp('yarn publish'));
});
