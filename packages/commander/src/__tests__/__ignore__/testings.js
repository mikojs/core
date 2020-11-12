// @flow

import { type optionsType } from '../../index';

export type testingType = [
  optionsType,
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
    [{}],
  ],
  [
    {
      name: 'commander',
      args: '<args>',
      version: '1.0.0',
      description: 'description',
      allowUnknownOption: true,
      exitOverride: true,
      options: [
        {
          flags: '-o <option>',
          description: 'option',
        },
      ],
    },
    ['args', '-o', 'option'],
    ['args', { o: 'option' }],
  ],
  [
    {
      name: 'commander',
      version: '1.0.0',
      description: 'description',
      commands: {
        command: {
          description: 'description',
        },
      },
    },
    ['command'],
    ['command', {}],
  ],
  [
    {
      name: 'commander',
      version: '1.0.0',
      description: 'description',
      commands: {
        command: {
          args: '<args>',
          description: 'description',
          allowUnknownOption: true,
          exitOverride: true,
          options: [
            {
              flags: '-o <option>',
              description: 'option',
            },
          ],
        },
      },
    },
    ['command', 'args', '-o', 'option'],
    ['command', 'args', { o: 'option' }],
  ],
]: $ReadOnlyArray<testingType>);
