#!/bin/sh

yarn lerna exec \
  "babel src -d lib --delete-dir-on-start --verbose --root-mode upward" \
  --scope @mikojs/miko \
  --scope @mikojs/lerna-run \
  --scope @mikojs/eslint-config-miko \
  --stream \
  --include-dependencies \
  $1
