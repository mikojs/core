module.exports = {
  lint: {
    description: 'Check code style with eslint.',
    action: 'esw --cache --color',
    commands: {
      prettier: {
        description: 'Disable `prettier/prettier` rule for running prettier.',
        action: 'miko lint --quiet --rule "prettier/prettier: off"',
      },
      watch: {
        description: 'Run eslint in watch mode.',
        action: 'miko lint prettier -w',
      },
    },
  },
};
