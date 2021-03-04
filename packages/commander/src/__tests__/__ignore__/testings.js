// @flow

import { type optionsType } from '../../index';

export type testingType = [
  optionsType<>,
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
      requiredOptions: [
        {
          flags: '-ro <option>',
          description: 'required option',
        },
      ],
    },
    ['args', '-o', 'option', '-ro', 'option'],
    ['args', { o: 'option', Ro: 'option' }],
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
          requiredOptions: [
            {
              flags: '-ro <option>',
              description: 'required option',
            },
          ],
        },
      },
    },
    ['command', 'args', '-o', 'option', '-ro', 'option'],
    ['command', 'args', { o: 'option', Ro: 'option' }],
  ],
]: $ReadOnlyArray<testingType>);
