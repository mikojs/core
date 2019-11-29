// @flow

import fs from 'fs';

import flowTypedLerna from '../flowTypedLerna';

jest.mock('fs');

describe('flow typed lerna', () => {
  test.each`
    fsExist
    ${true}
    ${false}
  `(
    'run "install" with node_module exist = $fsExist',
    ({ fsExist }: {| fsExist: boolean |}) => {
      // $FlowFixMe jest mock
      fs.existsSync.mockReturnValue(fsExist);

      expect(flowTypedLerna.run(['install']).slice(0, -1)).toEqual([
        'install',
        '-f',
      ]);
    },
  );

  test.each`
    option
    ${'-f'}
    ${'--flowVersion'}
  `(
    'not add flow-bin version with using $option',
    ({ option }: {| option: string |}) => {
      expect(flowTypedLerna.run(['install', option, 'version'])).toEqual([
        'install',
        option,
        'version',
      ]);
    },
  );
});
