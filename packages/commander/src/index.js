import commander from 'commander';

import transform from './transform';

const addConfg = (prevProgram, config, callback) => {
  const program = transform(config).reduce(
    (result, [key, ...args]) => result[key](...args),
    prevProgram,
  );

  program.config = config;
  program.action((...data) => callback(data));
  Object.keys(config.commands || {}).forEach(key =>
    addConfg(program.command(key), config.commands[key], data =>
      callback([key, ...data]),
    ),
  );
};

export default ({ name, ...config }) => argv =>
  new Promise(resolve => {
    const program = new commander.Command(name);

    addConfg(program, config, resolve);
    program.parse(argv);
  });
