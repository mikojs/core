// @flow

export default node => {
  node.data.content = `# node
node_modules

# babel
lib

# flow
flow-typed/npm

# jest
coverage

# add checking other configs
!.*.js
`;
};
