export default originalArgv => {
  const { env, argv } = originalArgv.reduce(
    (result, key) =>
      result.isEnv && /^[^ ]+=/.test(key)
        ? {
            ...result,
            env: [...result.env, key],
          }
        : {
            ...result,
            argv: [...result.argv, key],
            isEnv: false,
          },
    {
      env: [],
      argv: [],
      isEnv: true,
    },
  );

  return { env, argv };
};
