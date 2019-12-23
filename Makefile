ROOT=$(shell pwd)
BRANCH=$(shell git branch | grep \* | cut -d ' ' -f2)
WATCH=""

install-all:
	@yarn install
	@yarn lerna bootstrap
	@yarn patch-package
	@make babel-all

flow-typed-all:
	@yarn flow-typed install --verbose
	@yarn flow-mono create-symlinks .flowconfig && \
		yarn flow-mono install-types --ignoreDeps=peer

babel-all:
	@$(call babel-build)

babel-changed:
ifeq ($(shell printenv CI), true)
	@echo "Skip babel build"
else
	@$(call babel-build, $(WATCH), --since $(BRANCH))
endif

flow:
ifeq ($(shell printenv CI), true)
	@yarn lerna exec "flow --quiet && flow stop" --stream --concurrency 1
else
	@yarn lerna exec "flow --quiet" --stream --concurrency 1 --since $(BRANCH)
endif

release:
	@yarn lerna-changelog && \
		echo "\nContinue with any keyword or exit with 'ctrl + c'..." && \
		read -p ""
	@vim CHANGELOG.md && \
		git add CHANGELOG.md && \
		git commit -m "chore(root): add CHANGELOG.md"
	@yarn lerna version
	@open https://github.com/mikojs/core/releases

clean:
	@yarn lerna exec "rm -rf lib flow-typed/npm" \
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
		$(2)
	ln -snf $(ROOT)/packages/configs/lib/bin/index.js ./node_modules/.bin/configs
	ln -snf $(ROOT)/packages/badges/lib/bin/index.js ./node_modules/.bin/badges
	ln -snf $(ROOT)/server/server/lib/bin/index.js ./node_modules/.bin/server
	yarn lerna exec \
		"configs babel:lerna $(1)" \
		--parallel \
		--stream \
		$(2)
endef
