#!/bin/bash

version=${1/v/''}

yarn lerna publish \
  --skip-git \
  --force-publish=* \
  --repo-version $version \
  --yes \
  $2
