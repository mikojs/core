// @flow

import fs from 'fs';
import path from 'path';

import execa from 'execa';

import release from '../release';

jest.mock('fs');

describe('release', () => {
  beforeEach(() => {
    // $FlowFixMe jest mock
    fs.writeFileSync.mockClear();
  });

  test.each`
    changelog
    ${'changelog'}
    ${''}
  `(
    'changelog = $changelog',
    async ({ changelog }: {| changelog: string |}) => {
      const changelogFilePath = path.resolve('CHANGELOG.md');

      // $FlowFixMe jest mock
      fs.readFileSync.mockReturnValue('# CHANGELOG');
      execa.mockResolvedValue({ stdout: changelog });

      if (!changelog)
        await expect(release('1.0.0')).rejects.toThrow(
          'Could not find anything to release',
        );
      else await release('1.0.0');

      (!changelog
        ? expect(fs.writeFileSync).not
        : expect(fs.writeFileSync)
      ).toHaveBeenCalledWith(changelogFilePath, `# CHANGELOG\nchangelog`);
    },
  );
});
