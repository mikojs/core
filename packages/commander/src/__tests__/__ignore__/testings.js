// @flow

import { type optionType } from '../../index';

export type testingType = [
  optionType,
  $ReadOnlyArray<string>,
  $ReadOnlyArray<mixed>,
];

export default ([
  [
    {
      name: 'commander',
      version: '1.0.0',
      description: 'description',
    },
    [],
    ['_command'],
  ],
]: $ReadOnlyArray<testingType>);
