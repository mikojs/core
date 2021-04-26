const path = require('path');

const { warn } = console;

module.exports = filePath => {
  const filename = path.relative(__dirname, filePath).replace(/\.js/, '');

  try {
    const plugin = require(`@mikojs/yarn-${filename}`);

    return {
      name,
      factory: () => plugin,
    };
  } catch (e) {
    return require(path.resolve(
      './yarn-plugins',
      filename.replace(/plugin-/, ''),
      './bundles/@yarnpkg',
      filename,
    ));
  }
};
