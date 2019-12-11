// @flow

export default {
  run: () =>
    JSON.stringify({
      Binaries: {
        Node: {
          version: 'node version',
        },
        Yarn: {
          version: 'yarn version',
        },
        npm: {
          version: 'npm version',
        },
      },
    }),
};
