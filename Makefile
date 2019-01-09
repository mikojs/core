ROOT=$(shell pwd)

install-all:
	@yarn install
	@yarn lerna bootstrap
	@make flow-typed-install

flow-typed-install:
	rm -rf ./flow-typed
	@yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--stream \
		--include-filtered-dependencies \
		--scope @cat-org/lerna-flow-typed-install
	@ln -snf $(ROOT)/packages/lerna-flow-typed-install/lib/bin/index.js ./node_modules/.bin/lerna-flow-typed-install
	@yarn flow-typed install --verbose
	@yarn lerna exec "lerna-flow-typed-install --verbose" \
		--stream \
		--concurrency 1

babel-core:
	@make babel-clean
	@yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--include-filtered-dependencies \
		--scope @cat-org/configs \
		--scope @cat-org/babel-*
	@ln -snf $(ROOT)/packages/configs/lib/bin/index.js ./node_modules/.bin/configs

babel-all:
	@make babel-core
	@$(call babel-build)

babel-test:
	@make babel-core
	@$(call babel-build, \
		--scope @cat-org/jest \
		--scope @cat-org/eslint-config-cat)

babel-lint-staged:
	@make babel-core
	@$(call babel-build, \
		--scope @cat-org/utils \
		--scope @cat-org/eslint-config-cat \
		--scope @cat-org/badges)
	@ln -snf $(ROOT)/packages/badges/lib/bin/index.js ./node_modules/.bin/badges

babel-clean:
	rm -rf ./lib \
		./packages/**/lib \
		./server/**/lib

release:
	@yarn lerna-changelog && \
		echo "\nContinue with any keyword or exit with 'ctrl + c'..." && \
		read -p ""
	@vim CHANGELOG.md && \
		git add CHANGELOG.md && \
		git commit -m "chore(root): add CHANGELOG.md"
	@yarn lerna version

clean-all:
	@make babel-clean
	@yarn lerna clean && rm -rf ./node_modules
	rm -rf ./flow-typed
	rm -rf ./coverage
	rm -rf ./.eslintcache
	rm -rf ./.changelog
	rm -rf ./*.log

define babel-build
	yarn lerna exec \
		"configs babel:lerna" \
		--parallel \
		--stream \
		$(1)
endef
