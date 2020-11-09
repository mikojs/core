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
    [{}],
  ],
  [
    {
      name: 'commander <args>',
      version: '1.0.0',
      description: 'description',
    },
    ['args'],
    ['args', {}],
  ],
  [
    {
      name: 'commander',
      version: '1.0.0',
      description: 'description',
      options: [
        {
          flags: '-o <option>',
          description: 'option',
        },
      ],
    },
    ['-o', 'option'],
    [{ o: 'option' }],
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
    ['command'],
  ],
  [
    {
      name: 'commander',
      version: '1.0.0',
      description: 'description',
      commands: {
        command: {
          description: 'description',
          options: [
            {
              flags: '-o <option>',
              description: 'option',
            },
          ],
        },
      },
    },
    ['command', '-o', 'option'],
    ['command', { o: 'option' }],
  ],
]: $ReadOnlyArray<testingType>);
