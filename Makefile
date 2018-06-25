install-all:
	@yarn install
	@yarn lerna bootstrap
	@make babel-core
	@node ./lib/addScriptsToPkg
	@node ./lib/copyFlowFiles
	@make install-flow-typed

install-flow-typed:
	rm -rf ./flow-typed
	@yarn flow-typed install --verbose
	@yarn lerna run flow-typed

babel-core:
	@$(call babel-build, ./packages/utils)
	@$(call babel-build, .)

babel-all:
	@make babel-clean
	@make babel-core
	@for package in $$(node ./lib/findPackages -i utils -s); do \
	  $(call babel-build, ./packages/$$package); \
  done

babel-lint-staged:
	@$(call babel-build, ./packages/configs)
	@$(call babel-build, ./packages/eslint-config-cat)

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
	rm -rf ./*.log
	rm -rf ./packages/eslint-config-cat/.eslintcache

define babel-build
	yarn babel $(1)/src --out-dir $(1)/lib
endef
