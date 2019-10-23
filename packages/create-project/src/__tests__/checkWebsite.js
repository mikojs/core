// @flow

import fs from 'fs';
import path from 'path';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

const SKIP_FILE = ['src/pages/cms.js'];
const websiteFolder = path.resolve(__dirname, '../../../website');
const testFolder = path.resolve(
  __dirname,
  './__ignore__/lerna/relay-server-with-less',
);
const websiteFiles = d3DirTree(websiteFolder, {
  exclude: [/.*\.swp/, /lib/, /node_modules/],
})
  .leaves()
  .map(({ data: { path: filePath } }: d3DirTreeNodeType) => [
    path.relative(websiteFolder, filePath),
  ])
  .filter(([filePath]: [string]) => !SKIP_FILE.includes(filePath));
const testFiles = d3DirTree(testFolder, {
  exclude: /.*\.swp/,
})
  .leaves()
  .map(({ data: { path: filePath } }: d3DirTreeNodeType) => [
    path.relative(testFolder, filePath),
  ]);

describe('check website', () => {
  test('check the amount of the files', () => {
    expect(websiteFiles).toEqual(testFiles);
  });

  test.each(testFiles)('check `%s`', (filePath: string) => {
    const content = fs.readFileSync(path.resolve(websiteFolder, filePath), {
      encoding: 'utf-8',
    });
    const expected = fs.readFileSync(path.resolve(testFolder, filePath), {
      encoding: 'utf-8',
    });

    switch (filePath) {
      case 'README.md':
        expect(
          content
            .replace(
              /\[website\]:(.|\n)*## Usage/,
              `[website]: http://mikojs/package-homepage

package description

## Usage`,
            )
            .replace(/@mikojs\/website/g, 'package-name'),
        ).toBe(expected);
        break;

      case 'package.json':
        const JSONContent = JSON.parse(
          content.replace(/@mikojs\/website/g, 'package-name'),
        );

        delete JSONContent.dependencies;
        delete JSONContent.devDependencies;
        delete JSONContent.private;

        expect({
          ...JSONContent,
          description: 'package description',
          author: 'username <email>',
          homepage: 'http://mikojs/package-homepage',
          repository: 'https://github.com/mikojs/core.git',
          version: '1.0.0',
          keywords: ['keyword'],
          publishConfig: {
            access: 'public',
          },
        }).toEqual(JSON.parse(expected));
        break;

      default:
        expect(content).toBe(expected);
        break;
    }
  });
});
