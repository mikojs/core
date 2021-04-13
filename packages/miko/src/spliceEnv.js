export default originalArgv => {
  const { env, argv } = originalArgv.reduce(
    (result, key) => {
      if (result.isEnv && /^[^ ]+=/.test(key))
        return {
          ...result,
          env: [...result.env, key],
        };

      return {
        ...result,
        isEnv: false,
        argv: [...result.argv, key],
      };
    },
    {
      env: [],
      argv: [],
      isEnv: true,
    },
  );

  return { env, argv };
};
