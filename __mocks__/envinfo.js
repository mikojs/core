// @flow

export default {
  run: async () =>
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
