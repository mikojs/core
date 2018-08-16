// @flow

import * as diff from 'diff';

export default node => {
  const {
    data: { content, fileContent },
  } = node;

  node.data.diff =
    !content || !fileContent
      ? null
      : diff.diffTrimmedLines(fileContent, content);
};
