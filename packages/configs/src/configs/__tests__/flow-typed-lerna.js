// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';

import lernaFlowTyped from '../flow-typed-lerna';

jest.mock('fs');

describe('flow-typed-lerna', () => {
  test.each`
    fsExist
    ${true}
    ${false}
  `(
    'run "install" with node_module exist = $fsExist',
    ({ fsExist }: {| fsExist: boolean |}) => {
      fs.exist = fsExist;

      expect(lernaFlowTyped.run(['install']).slice(0, -1)).toEqual([
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
      expect(lernaFlowTyped.run(['install', option, 'version'])).toEqual([
        'install',
        option,
        'version',
      ]);
    },
  );
});
