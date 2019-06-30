// @flow

import Graphql from '../graphql';

test('graphql', () => {
  expect(new Graphql('folder path')).not.toBeUndefined();
});
