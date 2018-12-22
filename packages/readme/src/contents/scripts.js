// @flow

import type { ctxType } from './index';

export default ({ pkg: { scripts } }: ctxType) =>
  Object.keys(scripts)
    .map((key: string) => `- ${key}`)
    .join('\n');
