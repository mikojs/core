export default (commands, callback) =>
  commands
    .reduce(
      async (result, command) => {
        const { argv, exitCode } = await result;

        if (exitCode !== 0) return { argv, exitCode };

        if (command !== '&&')
          return {
            argv: [...argv, command],
            exitCode,
          };

        return {
          argv: [],
          exitCode: await callback(argv),
        };
      },
      Promise.resolve({
        argv: [],
        exitCode: 0,
      }),
    )
    .then(({ exitCode }) => exitCode);
