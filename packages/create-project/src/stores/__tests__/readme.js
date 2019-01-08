// @flow

import { outputFileSync } from 'output-file-sync';

import readme from '../readme';

import ctx from './__ignore__/ctx';

const mockPkg = {
  name: 'name',
  homepage: 'homepage',
  description: 'description',
};

readme.ctx = ctx;

test.each`
  pkg          | useNpm   | expected
  ${undefined} | ${false} | ${null}
  ${mockPkg}   | ${false} | ${'## Usage'}
  ${mockPkg}   | ${true}  | ${'## Install'}
`(
  'readme with pkg = $pkg and useNpm = $useNpm',
  async ({
    pkg,
    useNpm,
    expected,
  }: {
    pkg?: { [string]: string },
    useNpm: boolean,
    expected: ?string,
  }) => {
    outputFileSync.contents = [];

    expect(
      await readme.end({
        ...ctx,
        pkg,
        useNpm,
      }),
    ).toBeUndefined();

    if (!expected) expect(outputFileSync.contents.length).toBe(0);
    else expect(outputFileSync.contents[0]).toMatch(new RegExp(expected));
  },
);
