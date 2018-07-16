// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import type { flowTestType } from './definitions/index.js.flow';

export default (
  flowTests: $ReadOnlyArray<flowTestType>,
  targetPath: string,
) => {
  if (flowTests.length === 0) return;

  mkdirp.sync(path.dirname(targetPath));

  fs.writeFileSync(
    targetPath,
    `// @flow

${flowTests
      .map(
        ({ moduleName, exportType }: flowTestType): string =>
          `import type ${exportType} from '${moduleName}';`,
      )
      .join('\n')}

${flowTests
      .map(
        ({ exportType, relativePath }: flowTestType): string =>
          `import ${exportType.replace(/Type$/, '')} from '${relativePath}';`,
      )
      .join('\n')}

${flowTests
      .map(
        ({ exportType }: flowTestType): string =>
          `(${exportType.replace(/Type$/, '')}: ${exportType});`,
      )
      .join('\n')}
`,
  );
};
