// @flow

import { declare } from '@babel/helper-plugin-utils';
import type nodePathType from '@babel/traverse';

export default declare(
  (
    { assertVersion, types: t }: nodePathType,
    { dir }: {| dir: string |},
  ): {} => {
    assertVersion(7);

    return {};
  },
);
