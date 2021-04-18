import fs from 'fs';
import path from 'path';

import rimraf from 'rimraf';

import symlinkSync from '../symlinkSync';

const source = __filename;
const target = path.resolve(__filename, './folder/target.js');

jest.mock('fs');

describe('symlink sync', () => {
  beforeEach(() => {
    fs.symlinkSync.mockClear();
    rimraf.mockClear();
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

  test('remove linked file when target file exist', async () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.lstatSync.mockReturnValueOnce({
      isSymbolicLink: jest.fn().mockReturnValueOnce(true),
    });
    await symlinkSync(source, target, true);

    expect(rimraf).toHaveBeenCalledTimes(1);
  });

  test('remove linked file when target file does not exist', async () => {
    fs.existsSync.mockReturnValueOnce(false);
    await symlinkSync(source, target, true);

    expect(rimraf).not.toHaveBeenCalled();
  });
});
