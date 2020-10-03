#!/bin/bash

if [ ! -d ~/watchman ]; then
  git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1 ~/watchman
  cd ~/watchman
  ./autogen.sh
  ./configure --without-python
  make
fi

make install
