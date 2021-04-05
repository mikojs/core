import commander from 'commander';

export default ({ name, ...config }) => argv =>
  new Promise(resolve => {
    const program = new commander.Command(name);

    program.parse(argv);
  });
