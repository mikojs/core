require('../../../.pnp.cjs').setup();

const path = require('path');

module.exports = filename => {
  const name = path.relative(__dirname, filename).replace(/\.js/, '');
  const names = {
    miko: `@mikojs/yarn-${name}`,
    yarn: `@yarnpkg/${name}`,
  };

  try {
    const plugin = require(names.miko);

    return {
      name: names.yarn,
      factory: () => plugin,
    };
  } catch (e) {
    const { error } = console;
    const sourcePath = path.resolve(
      __dirname, '../../../yarn-plugins',
      name.replace(/plugin-/, ''),
    );

    if (!new RegExp(`Source path: ${sourcePath}/\n`).test(e.message)) error(e);

    return require(path.resolve(
      sourcePath,
      './bundles',
      names.yarn,
    ));
  }
};
