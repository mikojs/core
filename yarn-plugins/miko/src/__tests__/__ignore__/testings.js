const config = {
  miko: {
    command: ['test-miko'],
  },
};

const args = ['miko-todo', 'miko'];

export default [
  ['does not have any config', null, args, 'miko-todo miko'],
  ['run a custom command', config, args, 'test-miko'],
  [
    'run a custom command with other args',
    config,
    [...args, 'a'],
    'test-miko a',
  ],
];
