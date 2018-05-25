build-core:
	@./node_modules/.bin/babel src --out-dir lib

build-utils:
	@yarn lerna run babel --scope cat-utils

install-flow-typed:
	@make build-core
	@make build-utils
	@for package in $$(node ./lib/findPackages); do \
		yarn flow-typed install -p ./packages/$$package --verbose; \
	done

install:
	@yarn install
	@yarn lerna bootstrap
	@make install-flow-typed

babel:
	@make babel-clean
	@make build-core
	@yarn lerna run babel

flow:
	@./node_modules/.bin/flow

lint:
	@yarn lerna run babel --scope eslint-config-cat
	@yarn lerna run lint

test:
	@make build-core
	@make build-utils
	@yarn jest --silent

babel-clean:
	@rm -rf ./lib ./packages/**/lib

clean:
	@make babel-clean
	@rm -rf ./node_modules ./packages/**/node_modules
	@rm -rf ./flow-typed
	@rm -rf ./coverage
	@rm -rf ./lerna-debug.log
	@rm -rf ./packages/eslint-config-cat/.eslintcache
