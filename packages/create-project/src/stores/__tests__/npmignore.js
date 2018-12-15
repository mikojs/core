// @flow

import { inquirer } from 'inquirer';
import { outputFileSync } from 'output-file-sync';

import npmignore from '../npmignore';

import ctx from './__ignore__/ctx';

npmignore.ctx = ctx;

test.each`
  useNpm   | expected
  ${true}  | ${['/projectDir/.npmignore']}
  ${false} | ${[]}
`(
  'npmignore with useNpm = $useNpm',
  async ({
    useNpm,
    expected,
  }: {
    useNpm: boolean,
    expected: $ReadOnlyArray<string>,
  }): Promise<void> => {
    outputFileSync.destPaths = [];
    npmignore.storeUseNpm = useNpm;
    inquirer.result = {
      useNpm,
    };

    expect(await npmignore.start(ctx)).toBeUndefined();
    expect(await npmignore.end(ctx)).toBeUndefined();
    expect(outputFileSync.destPaths).toEqual(expected);
  },
);
