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
      return stdout.write?.interceptor.errorMessage && callbacks.length !== 0
        ? execRace(argv, options, ...callbacks)
        : exitCode;
  }
};

export default execRace;
