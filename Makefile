install-all:
	@yarn install
	@yarn lerna bootstrap
	@make install-flow-typed

install-flow-typed:
	@make babel-core
	@for package in $$(node ./lib/findPackages); do \
		yarn flow-typed install -p ./packages/$$package --verbose; \
	done

babel-core:
	@$(call babel-build, ./packages/cat-utils)
	@$(call babel-build, .)

babel-all:
	@make babel-clean
	@make babel-core
	@for package in $$(node ./lib/findPackages -i cat-utils); do \
	  $(call babel-build, ./packages/$$package); \
  done

lint:
	@$(call babel-build, ./packages/eslint-config-cat)
	@yarn lerna run lint --scope eslint-config-cat

test:
	@make babel-all
	@yarn jest --silent ./

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
