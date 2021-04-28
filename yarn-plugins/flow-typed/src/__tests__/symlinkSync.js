import fs from 'fs';
import path from 'path';

import symlinkSync from '../symlinkSync';

const source = path.resolve(__dirname, './source.js');
const target = path.resolve(__dirname, './target.js');

jest.mock('fs');

describe('symlink sync', () => {
  beforeEach(() => {
    fs.symlinkSync.mockClear();
  });

  test('link file when target file does not exist', async () => {
    fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
    await symlinkSync(source, target, false);

    expect(fs.symlinkSync).toHaveBeenCalledTimes(1);
    expect(fs.symlinkSync).toHaveBeenCalledWith(source, target);
  });

  test('link file when source file does not exist', async () => {
    fs.existsSync.mockReturnValueOnce(false);
    await symlinkSync(source, target, false);

    expect(fs.symlinkSync).not.toHaveBeenCalled();
  });
});
