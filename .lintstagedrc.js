module.exports = {
  '*.js': ['prettier --write'],
  '*.md': ['prettier --write --parser markdown'],
  '*.json': ['prettier --write --parser json'],
  'package.json': [
    'prettier-package-json --write',
    'prettier --write --parser json',
  ],
};
