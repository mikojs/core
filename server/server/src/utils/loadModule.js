// @flow

export default <T>(
  moduleName: string,
  defaultFunc: T,
  ...options: $ReadOnlyArray<mixed>
): T => {
  try {
    if (options.length === 0)
      return require(moduleName).default || require(moduleName);

    return (require(moduleName).default || require(moduleName))(...options);
  } catch (e) {
    if (/Cannot find module/.test(e.message)) return defaultFunc;

    throw e;
  }
};
