#!/bin/sh

BASIC_PACKAGES="@mikojs/miko @mikojs/lerna-run @mikojs/eslint-config-miko"
SOPCES=""

for package in $BASIC_PACKAGES; do
  SOPCE="$SOPCE --scope $package"
done

yarn lerna exec \
  "babel src -d lib --delete-dir-on-start --verbose --root-mode upward" \
  --stream \
  --include-dependencies \
  $SOPCES \
  $1
