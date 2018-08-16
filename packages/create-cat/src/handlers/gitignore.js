// @flow

export default node => {
  node.data.content = `# default
*.swp
*.log
.DS_Store

# node
node_modules

# babel
lib

# eslint
.eslintcache

# flow
flow-typed/npm

# jest
coverage
`;
};
