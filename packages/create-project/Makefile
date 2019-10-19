TEST_FILE="new (require('@mikojs/koa-graphql'))(require('path').resolve(__dirname, './lib/graphql')).relay(['--src', require('path').resolve(__dirname, './src')]);"
LIST=relay-server relay-server-with-css relay-server-with-less lerna/relay-server lerna/relay-server-with-css lerna/relay-server-with-less

test:
	@for file in $(LIST); do \
		cp -r ./src/__tests__/__ignore__/$$file ./cache; \
		echo $(TEST_FILE) >> ./cache/test.js; \
		yarn configs exec babel ./cache/src/graphql -d ./cache/lib/graphql --config-file ../../babel.config.js --verbose --configs-files babel; \
		node ./cache/test.js; \
		$(call copy-file,$$file,src/pages/__generated__/); \
		$(call copy-file,$$file,src/utils/createEnvironment/__tests__/__generated__/); \
		rm -rf ./cache; \
		if [ -d ./cache ]; then \
			echo "\033[0;31mError: Can not remove cache folder\033[0m"; \
			exit 1; \
			fi \
	done

define copy-file
	cp -r ./cache/$(2) ./src/__tests__/__ignore__/$(1)/$(2)
endef
