export default {
  '*.js': ['prettier' /* TODO , 'miko lint' */],
  // TODO '*.js.flow': ['miko prettier --parser flow'],
  '*.md': 'prettier --parser markdown',
  '**/package.json': [
    'prettier-package-json --write',
    'prettier --parser json',
  ],
};
