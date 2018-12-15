// @flow

import { execa } from 'execa';

import flow from '../flow';

import ctx from './__ignore__/ctx';

flow.ctx = ctx;

test.each`
  cmd       | expected
  ${'npm'}  | ${'npm install -D'}
  ${'yarn'} | ${'yarn add --dev'}
`(
  'flow with cmd = $cmd',
  async ({
    cmd,
    expected,
  }: {
    cmd: string,
    expected: string,
  }): Promise<void> => {
    execa.cmds = [];

    expect(
      await flow.end({
        ...ctx,
        cmd,
      }),
    ).toBeUndefined();
    expect(execa.cmds[0]).toBe(`${expected} flow-bin flow-typed`);
  },
);
