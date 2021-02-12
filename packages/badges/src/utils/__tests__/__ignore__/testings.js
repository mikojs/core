// @flow

import badges, { type badgeType } from '../../badges';

export type testingType = [string, boolean, $ReadOnlyArray<string>];

export default ([
  [
    'npm package',
    true,
    badges.reduce(
      (result: $ReadOnlyArray<string>, { name }: badgeType) =>
        name === 'github-size' ? result : [...result, name],
      [],
    ),
  ],
  [
    'github repo',
    false,
    ['github-size', 'engine-node', 'engine-npm', 'engine-yarn'],
  ],
]: $ReadOnlyArray<testingType>);
