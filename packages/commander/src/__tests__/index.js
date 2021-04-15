import commander from '..';

test('commander', async () => {
  expect(
    await new Promise(resolve => {
      commander({
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
                description: 'description',
              },
            ],
            requiredOptions: [
              {
                flags: '-ro <requiredOption>',
                description: 'description',
              },
            ],
            action: (args, program) => resolve([args, program.opts()]),
          },
        },
      }).parse([
        'node',
        'commander',
        'command',
        'args',
        '-o',
        'option',
        '-ro',
        'requiredOption',
      ]);
    }),
  ).toEqual([
    'args',
    {
      o: 'option',
      Ro: 'requiredOption',
    },
  ]);
});
