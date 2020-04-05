ROOT=$(shell pwd)
BRANCH=$(shell git branch | grep \* | cut -d ' ' -f2)
WATCH="-w"

install-all:
	@yarn install
	@yarn lerna bootstrap
	@make build

build:
	@$(call build-base)
	@yarn miko
	@$(call babel)

dev:
ifeq ($(shell printenv CI), true)
	@echo "Skip babel build"
else
	@$(call build-base,--since $(BRANCH))
endif
	@yarn miko
	@$(call babel,$(WATCH),--since $(BRANCH) --parallel)

define build-base
	yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--include-dependencies \
		--scope @mikojs/configs \
		--scope @mikojs/babel-* \
		$(1)
	ln -snf $(ROOT)/packages/configs/lib/bin/index.js ./node_modules/.bin/configs
	ln -snf $(ROOT)/packages/miko/lib/bin/index.js ./node_modules/.bin/miko
	ln -snf $(ROOT)/packages/badges/lib/bin/index.js ./node_modules/.bin/badges
	ln -snf $(ROOT)/server/server/lib/bin/index.js ./node_modules/.bin/server
endef

define babel
  yarn lerna exec \
		'babel src -d lib --config-file ../../babel.config.js $(1)' \
		--stream \
		$(2)
endef
