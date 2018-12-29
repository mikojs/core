// @flow

import Store from './index';

import type { ctxType } from './index';

/**
 * @example
 * template(true)
 *
 * @param {boolean} useNpm - use npm or not
 *
 * @return {string} - circleci config
 */
const template = (useNpm?: boolean) => `version: 2
defaults: &defaults
  docker:
    - image: node:latest
  working_directory: ~/repo

restore-cache: &restore-cache
  keys:
    - dependencies-{{ checksum "yarn.lock" }}
    - dependencies-

save-cache: &save-cache
  paths:
    - node_modules
    - flow-typed
    - ~/.flow-typed
  key: dependencies-{{ checksum "yarn.lock" }}

install: &install
  name: Install packages
  command: yarn install

jobs:
  test:
    <<: *defaults
    steps:
      - checkout
      - restore_cache: *restore-cache
      - run: *install
      - save_cache: *save-cache

      - run:
          name: Check code style
          command: |
            yarn flow-typed install
            yarn configs lint .
            yarn flow

      - run:
          name: Test
          command: yarn test -i
      - store_artifacts:
          path: coverage
${
  useNpm
    ? `
  deploy-beta:
    <<: *defaults
    steps:
      - checkout
      - restore_cache: *restore-cache
      - run: *install

      - run:
          name: Pre publish
          command: |
            yarn prod
            yarn flow

      - run: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

      - run:
          name: Publish
          command: yarn publish --tag beta
`
    : ''
}
workflows:
  version: 2
  test-and-deploy:
    jobs:
      ${
        useNpm
          ? `- test:
          filters:
            tags:
              only: /.*/

      - deploy-beta:
          context: global-env
          requires:
            - test
          filters:
            branches:
              ignore: /.*/
            tags:
              only: /v\\d+(.\\d+){2}(-beta.\\d+)?/`
          : `- test`
      }`;

/** circleci store */
class Circleci extends Store {
  /**
   * @example
   * circleci.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = ({ useNpm }: ctxType) => {
    this.writeFiles({
      '.circleci/config.yml': template(useNpm),
    });
  };
}

export default new Circleci();
