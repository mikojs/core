// @flow

export default relativeFilePath => {
  const handlerPath = relativeFilePath
    .replace(/^\.\/[.]?/, './')
    .replace(/.json$/, '');

  try {
    return require(handlerPath);
  } catch (e) {
    // TODO remove
    return () => {};
  }
};
