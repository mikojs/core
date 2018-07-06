// @flow

// eslint-disable-next-line max-len
import type { throwMessageInIndexType } from './definitions/throwMessageInIndex.js.flow';

export default ((packageName: string) => {
  throw new Error(
    // eslint-disable-next-line max-len
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
}: throwMessageInIndexType);
