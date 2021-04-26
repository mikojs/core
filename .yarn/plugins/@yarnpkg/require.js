const path = require('path');

const { error } = console;

module.exports = filePath => {
  const filename = path.relative(__dirname, filePath).replace(/\.js/, '');
  const names = {
    miko: `@mikojs/yarn-${filename}`,
    yarn: `@yarnpkg/${filename}`,
  };

  try {
    const plugin = require(names.miko);

    return {
      name: names.yarn,
      factory: () => plugin,
    };
  } catch (e) {
    if (!new RegExp(`${names.miko}/lib/index.js`).test(e.message)) error(e);

    return require(path.resolve(
      './yarn-plugins',
      filename.replace(/plugin-/, ''),
      './bundles',
      names.yarn,
    ));
  }
};
