install-all:
	@yarn install
	@yarn lerna bootstrap
	@make install-flow-typed

install-flow-typed:
	rm -rf ./flow-typed
	@yarn flow-typed install --verbose
	@yarn lerna exec --parallel "flow-typed install -f 0.76.0 --verbose"

babel-core:
	@yarn babel src -d lib
	@$(call babel-build, --scope @cat-org/utils)
	@$(call babel-build, --scope @cat-org/configs)

babel-all:
	@make babel-clean
	@$(call babel-build)

babel-test:
	@make babel-clean
	@make babel-core
	@$(call babel-build, --scope @cat-org/eslint-config-cat)

babel-lint-staged:
	@make babel-core
	@$(call babel-build, --scope @cat-org/eslint-config-cat)
	@yarn lerna exec --parallel "node \$LERNA_ROOT_PATH/lib/bin/copyFlowFiles"

release:
	@yarn lerna publish --skip-npm --skip-git --repo-version ${VERSION}
	@yarn lerna-changelog && \
		read -p "Input any word..." && \
		vim CHANGELOG.md && \
		git add . && \
		git commit -m "chore(release): v${VERSION} [skip ci]" && \
		git tag -a v${VERSION} -m "v${VERSION}"

babel-clean:
	rm -rf ./lib ./packages/**/lib

clean-all:
	@make babel-clean
	rm -rf ./node_modules ./packages/**/node_modules
	rm -rf ./flow-typed
	rm -rf ./coverage
	rm -rf ./.eslintcache
	rm -rf ./.changelog
	rm -rf ./*.log

define babel-build
	yarn lerna exec --parallel "babel src -d lib --config-file ../../babel.config.js" $(1) && \
  yarn lerna exec --parallel "node \$LERNA_ROOT_PATH/lib/bin/copyFlowFiles" $(1)
endef
