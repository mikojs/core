// @flow

import type { throwMessageInIndexType } from './definitions/throwMessageInIndex.js.flow';

export default ((packageName: string) => {
  throw new Error(
    `Do not import module with \`${packageName}\`. Use \`${packageName}/lib/<module>\`.`,
  );
}: throwMessageInIndexType);
