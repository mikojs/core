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

    if (!new RegExp(names.miko).test(e.message)) error(e);

    return require(path.resolve(
      __dirname,
      '../../../yarn-plugins',
      name.replace(/plugin-/, ''),
      './bundles',
      names.yarn,
    ));
  }
};
