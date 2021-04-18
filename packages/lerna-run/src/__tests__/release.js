import fs from 'fs';
import path from 'path';

import execa from 'execa';

import release, { errorMessage } from '../release';

jest.mock('fs');

describe('release', () => {
  beforeEach(() => {
    fs.readFileSync.mockClear();
    execa.mockClear();
  });

  test('lerna-changelog output a changelog content', async () => {
    execa.mockReturnValueOnce({ stdout: 'example' });
    fs.readFileSync.mockReturnValue('# CHANGELOG');
    await release('1.0.0');

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('CHANGELOG.md'),
      '# CHANGELOG\nexample',
    );
  });

  test('lerna-changelog does not output anything', async () => {
    execa.mockReturnValueOnce({ stdout: '' });

    await expect(release('1.0.0')).rejects.toThrow(errorMessage);
  });
});
