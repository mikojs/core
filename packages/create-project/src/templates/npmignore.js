// @flow

export default (lerna: boolean) =>
  lerna
    ? `# babel
src`
    : `# default
*.log

# node
node_modules

# babel
src

# eslint
.eslintcache

# flow
.flowignore
flow-typed

# jest
coverage
__tests__
__mocks__

# circleci
.circleci`;
