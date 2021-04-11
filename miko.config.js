module.exports = {
  lint: {
    description: 'Check code style with eslint.',
    options: [
      {
        flags: '-w, --watch',
        description: 'Run eslint in watch mode',
      },
    ],
    action: ({ watch }) =>
      watch ? 'miko lint prettier -w' : 'esw --cache --color',
    commands: {
      prettier: {
        description: 'Disable `prettier/prettier` rule for running prettier.',
        action: 'miko lint --quiet --rule "prettier/prettier: off"',
      },
    },
  },
};
