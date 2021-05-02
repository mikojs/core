export default [
  ['does not have any config', null, 'miko-todo miko'],
  [
    'run a custom command',
    {
      miko: {
        command: ['test-miko'],
      },
    },
    'test-miko',
  ],
];
