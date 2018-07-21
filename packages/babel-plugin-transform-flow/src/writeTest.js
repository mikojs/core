// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import type { flowFileType } from './definitions/index.js.flow';

export default (
  flowFiles: $ReadOnlyArray<flowFileType>,
  flowTestPath: string,
) => {
  const flowTests = flowFiles.filter(
    ({ source }: flowFileType): boolean => !/ignore test/.test(source),
  );

  if (flowTests.length === 0) return;

  mkdirp.sync(path.dirname(flowTestPath));

  fs.writeFileSync(
    flowTestPath,
    `// @flow

${flowTests
      .map(
        ({ moduleName, exportType }: flowFileType): string =>
          `import type ${exportType} from '${moduleName}';`,
      )
      .join('\n')}

${flowTests
      .map(
        ({ exportType, filename }: flowFileType): string =>
          `import ${exportType.replace(/Type$/, '')} from '${path
            .relative(path.dirname(flowTestPath), filename)
            .replace(/\.js$/, '')
            .replace(/\/index$/, '')}';`,
      )
      .join('\n')}

${flowTests
      .map(
        ({ exportType }: flowFileType): string =>
          `(${exportType.replace(/Type$/, '')}: ${exportType});`,
      )
      .join('\n')}`,
  );
};
