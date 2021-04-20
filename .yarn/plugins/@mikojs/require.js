const path = require('path');

module.exports = filePath => {
  const name = [
    '@mikojs',
    path.relative(__dirname, filePath).replace(/\.js/, ''),
  ].join('/');

  try {
    return require(name);
  } catch (e) {
    return {
      name,
      factory: () => ({}),
    };
  }
};
