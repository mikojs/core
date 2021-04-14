module.exports = {
  '*.js': ['miko lint prettier', 'prettier --write'],
  '*.md': ['prettier --write --parser markdown'],
  '*.json': ['prettier --write --parser json'],
  '*.yml': ['prettier --write --parser yaml'],
  'package.json': [
    'prettier-package-json --write',
    'prettier --write --parser json',
  ],
};
