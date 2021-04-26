const path = require('path');

const { error } = console;

module.exports = filePath => {
  const filename = path.relative(__dirname, filePath).replace(/\.js/, '');

  try {
    const plugin = require(`@mikojs/yarn-${filename}`);

    return {
      name: `@yarnpkg/${filename}`,
      factory: () => plugin,
    };
  } catch (e) {
    if (!new RegExp(`@mikojs/yarn-${filename}/lib/index.js`).test(e.message))
      error(e);

    return require(path.resolve(
      './yarn-plugins',
      filename.replace(/plugin-/, ''),
      './bundles/@yarnpkg',
      filename,
    ));
  }
};
