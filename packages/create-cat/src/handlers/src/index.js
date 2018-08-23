// @flow

export default node => {
  node.data.content = `// @flow

export default () => {
  throw new Error('generate by @cat-org/create-cat. Remove this file.');
};`;
};
