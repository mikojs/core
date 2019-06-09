// @flow

export default (configsEnv: $ReadOnlyArray<string>) => `// @flow

module.exports = {
  configsEnv: [${configsEnv.map((env: string) => `'${env}'`).join(', ')}],
};`;
