#!/bin/bash

if type watchman > /dev/null; then
  exit 0;
fi

git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1 ~/watchman
cd ~/watchman
./autogen.sh
./configure --without-python
make
make install
