const execRace = async (argv, options, callback, ...callbacks) => {
  const exitCode = await callback(argv, options);
  const { stdout } = options;

  switch (exitCode) {
    case 0:
      return 0;

    case 130:
      stdout.write('\n');

      return 130;

    default:
      return callbacks.length == 0
        ? exitCode
        : execRace(argv, options, ...callbacks);
  }
};

export default execRace;
