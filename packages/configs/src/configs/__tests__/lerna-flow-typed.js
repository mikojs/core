// @flow

// $FlowFixMe jest mock
import { fs } from 'fs';

import lernaFlowTyped from '../lerna-flow-typed';

jest.mock('fs');

describe('lerna-flow-typed', () => {
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
