module.exports = {
  presets: [
    '@mikojs/miko',
  ],
  plugins: [
    [
      '@babel/proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/proposal-class-properties',
    [
      '@babel/proposal-pipeline-operator',
      {
        proposal: 'hack',
        topicToken: '%',
      },
    ],
    'add-module-exports',
  ],
};
