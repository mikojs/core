module.exports = {
  '*.js': ['yarn miko-todo lint prettier', 'prettier --write'],
  '*.md': ['prettier --write --parser markdown'],
  '*.yml': ['prettier --write --parser yaml'],
  '*.json': ['prettier --write --parser json'],
  'package.json': [
    'prettier-package-json --write',
    'prettier --write --parser json',
  ],
};
