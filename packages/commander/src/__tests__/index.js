import commander from '..';

const config = {
  name: 'commander',
  version: '1.0.0',
  description: 'description',
  exitOverride: true,
  commands: {
    command: {
      description: 'description',
      arguments: '<args>',
      options: [
        {
          flags: '-o <option>',
          description: 'option',
        },
      ],
      requiredOptions: [
        {
          flags: '-ro <requiredOption>',
          description: 'required option',
        },
      ],
    },
  },
};

test('commander', async () => {
  expect(
    (
      await commander(config)([
        'node',
        'commander',
        'command',
        'args',
        '-o',
        'option',
        '-ro',
        'requiredOption',
      ])
    ).reduce(
      (result, value) =>
        typeof value === 'string' || value instanceof Array
          ? [...result, value]
          : [
              ...result,
              ['o', 'Ro', 'config'].reduce(
                (subResult, key) => ({
                  ...subResult,
                  [key]: value[key],
                }),
                {},
              ),
            ],
      [],
    ),
  ).toEqual([
    'command',
    'args',
    {
      o: 'option',
      Ro: 'requiredOption',
      config: config.commands.command,
    },
  ]);
});
