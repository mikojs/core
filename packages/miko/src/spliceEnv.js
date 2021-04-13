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
            isEnv: false,
            argv: [...result.argv, key],
          },
    {
      env: [],
      argv: [],
      isEnv: true,
    },
  );

  return { env, argv };
};
