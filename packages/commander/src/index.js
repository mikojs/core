import commander from 'commander';

import transform from './transform';

const addConfg = (prevProgram, config) => {
  const program = transform(config).reduce(
    (result, [key, ...args]) => result[key](...args),
    prevProgram,
  );

  Object.keys(config.commands || {}).forEach(key =>
    addConfg(program.command(key), config.commands[key]),
  );
};

export default ({ name, ...config }) => {
  const program = new commander.Command(name);

  addConfg(program, config);

  return program;
};
