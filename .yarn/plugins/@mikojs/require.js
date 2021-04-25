const path = require('path');

const { warn } = console;

module.exports = filePath => {
  const name = [
    '@mikojs',
    path.relative(__dirname, filePath).replace(/\.js/, ''),
  ].join('/');

  try {
    return require(name);
  } catch (e) {
    if (
      !new RegExp(
        `Cannot find module '${path.resolve(
          __dirname,
          '../../../node_modules',
          name,
          './lib/index.js',
        )}'`,
      ).test(e.message)
    )
      warn(e.message);

    return {
      name,
      factory: () => ({}),
    };
  }
};
