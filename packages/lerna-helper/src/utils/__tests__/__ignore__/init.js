// @flow

import fs from 'fs';

import rimraf from 'rimraf';

/** */
export default () => {
  rimraf.mockClear();
  // $FlowFixMe jest mock
  fs.symlinkSync.mockClear();
  // $FlowFixMe jest mock
  fs.existsSync.mockImplementation(
    (filePath: string) => !/test/.test(filePath),
  );
  // $FlowFixMe jest mock
  fs.lstatSync.mockImplementation((filePath: string) => ({
    isSymbolicLink: jest.fn().mockReturnValue(!/test/.test(filePath)),
  }));
};
