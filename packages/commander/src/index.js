import commander from 'commander';

const OPTIONS = [
  'version',
  'description',
  'arguments',
  'allowUnknownOption',
  'exitOverride',
  'options',
  'requiredOptions',
  'action',
];

const addConfg = (prevProgram, config) => {
  const program = OPTIONS.reduce((result, key) => {
    const value = config[key];

    if (!value) return result;

    if (['options', 'requiredOptions'].includes(key))
      return value.reduce(
        (subResult, { flags, description }) =>
          subResult[key.replace(/s$/, '')](flags, description),
        result,
      );

    return (
      {
        version: () =>
          result.version(value, '-v --version', 'Output the version number.'),
        description: () =>
          result
            .description(value)
            .helpOption('-h, --help', 'Display help for command.'),
        arguments: () => result.arguments(value),
        action: () => result.action(value),
      }[key]?.() || result[key]()
    );
  }, prevProgram);

  Object.keys(config.commands || {}).forEach(key =>
    addConfg(program.command(key), config.commands[key]),
  );
};

export default ({ name, ...config }) => {
  const program = new commander.Command(name);

  addConfg(program, config);

  return program;
};
