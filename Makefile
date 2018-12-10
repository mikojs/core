ROOT=$(shell pwd)

install-all:
	@yarn install
	@yarn lerna bootstrap
	@make install-flow-typed

install-flow-typed:
	rm -rf ./flow-typed
	@yarn flow-typed install --verbose
	@yarn lerna exec \
		"flow-typed install -f 0.87.0 --verbose" \
		--parallel \
		--stream

babel-core:
	@make babel-clean
	@yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--scope @cat-org/utils \
		--scope @cat-org/configs \
		--scope @cat-org/logger \
		--scope @cat-org/babel-*
	@ln -snf $(ROOT)/packages/configs/lib/bin/index.js ./node_modules/.bin/configs

babel-all:
	@make babel-core
	@$(call babel-build)

babel-test:
	@make babel-core
	@$(call babel-build, \
		--scope @cat-org/eslint-config-cat)

babel-lint-staged:
	@make babel-core
	@$(call babel-build, \
		--scope @cat-org/utils \
		--scope @cat-org/eslint-config-cat)

babel-clean:
	rm -rf ./lib ./packages/**/lib

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
