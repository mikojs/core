const config = {
  miko: {
    command: ['test-miko'],
  },
};

export default [
  ['does not have any config', null, ['miko-todo', 'miko'], 'miko-todo miko'],
  ['run a custom command', config, ['miko-todo', 'miko'], 'test-miko'],
  [
    'run a custom command with other atgs',
    config,
    ['miko-todo', 'miko', 'a'],
    'test-miko a',
  ],
];
