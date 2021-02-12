// @flow

import fs from 'fs';
import path from 'path';

import dirTree, { type dirTreeNodeType } from '@mikojs/dir-tree';

import { hyphenate } from 'fbjs';

export type testingType = [string, string, $ReadOnlyArray<[number, string]>];

const expectErrorRegExp = /^[ ]*(\/\/|\*|\/\*\*) \$expectError /;

export default (dirTree(path.resolve(__dirname, './files'), {
  extensions: /\.js$/,
})
  .leaves()
  .map(({ data: { path: filePath, name } }: dirTreeNodeType) => {
    const code = fs.readFileSync(filePath, 'utf-8');

    return [
      hyphenate(name.replace(/.js/, '')),
      code,
      code.split(/\n/g).reduce(
        (result: $ElementType<testingType, 2>, text: string, index: number) =>
          !expectErrorRegExp.test(text)
            ? result
            : [
                ...result,
                ...text
                  .replace(expectErrorRegExp, '')
                  .split(/, /)
                  .map((key: string) => [index === 0 ? 1 : index + 2, key]),
              ],
        [],
      ),
    ];
  }): $ReadOnlyArray<testingType>);
