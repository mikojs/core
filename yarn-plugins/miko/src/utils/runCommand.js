export default (command, callback) =>
  command.reduce(
    async (result, str) => {
      const { argv, exitCode } = await result;

      if (exitCode !== 0) return { argv, exitCode };

      if (str !== '&&')
        return {
          argv: [...argv, str],
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
  );
