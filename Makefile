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

clean:
	@yarn lerna exec "rm -rf lib flow-typed/npm"
	@yarn lerna exec "rm -rf .flowconfig" \
		--ignore @mikojs/eslint-config-base \
		--ignore @mikojs/koa-graphql \
		--ignore @mikojs/use-css \
		--ignore @mikojs/use-less \
		--ignore @mikojs/website
	@yarn lerna clean && rm -rf ./node_modules
	rm -rf ./flow-typed/npm
	rm -rf ./coverage
	rm -rf ./.eslintcache
	rm -rf ./.changelog
	rm -rf ./*.log

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
