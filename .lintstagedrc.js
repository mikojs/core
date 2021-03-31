module.exports = {
  '*.md': ['prettier --write --parser markdown'],
  '**/package.json': [
    'prettier-package-json --write',
    'prettier --write --parser json',
  ],
};
