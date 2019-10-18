LIST=relay-server relay-server-with-css relay-server-with-less lerna/relay-server lerna/relay-server-with-css lerna/relay-server-with-less

test:
	@for file in $(LIST); do \
		echo "Copy \033[0;32m__generated__\033[0m to \033[0;32m$$file\033[0m."; \
	  $(call copy-file,$$file,pages/__generated__); \
	  $(call copy-file,$$file,utils/createEnvironment/__tests__/__generated__); \
	done

define copy-file
  rm -rf ./src/__tests__/__ignore__/$(1)/src/$(2) && \
	cp -r \
		../website/src/$(2) \
		./src/__tests__/__ignore__/$(1)/src/$(2)
endef
