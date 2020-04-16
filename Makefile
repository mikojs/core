ROOT=$(shell pwd)
BRANCH=$(shell git branch | grep \* | cut -d ' ' -f2)

babel-base-all:
	@$(call babel-build)

babel-base-changed:
ifeq ($(shell printenv CI), true)
	@echo "Skip babel build"
else
	@$(call babel-build, --since $(BRANCH))
endif

define babel-build
	yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--include-dependencies \
		--scope @mikojs/miko \
		--scope @mikojs/configs \
		--scope @mikojs/babel-* \
		$(1)
	ln -snf $(ROOT)/packages/miko/lib/bin/index.js ./node_modules/.bin/miko
	ln -snf $(ROOT)/packages/badges/lib/bin/index.js ./node_modules/.bin/badges
	ln -snf $(ROOT)/server/server/lib/bin/index.js ./node_modules/.bin/server
endef
