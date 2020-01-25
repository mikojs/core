ROOT=$(shell pwd)
BRANCH=$(shell git branch | grep \* | cut -d ' ' -f2)

install-all:
	@yarn install
	@yarn lerna bootstrap
	@make babel-base-all
	@yarn configs exec lerna:babel

babel-base-all:
	@$(call babel-build)

babel-base-changed:
	@$(call babel-build, --since $(BRANCH))

define babel-build
	yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--include-dependencies \
		--scope @mikojs/configs \
		--scope @mikojs/babel-* \
		$(1)
	ln -snf $(ROOT)/packages/configs/lib/bin/index.js ./node_modules/.bin/configs
	ln -snf $(ROOT)/packages/badges/lib/bin/index.js ./node_modules/.bin/badges
	ln -snf $(ROOT)/server/server/lib/bin/index.js ./node_modules/.bin/server
endef
