
PACKAGE_DIR = web-ext-artifacts
IGNORE_FILES = test
API_KEY = $(shell cat ~/.firefox/add-on/JWT_issuer)
API_SECRET = $(shell cat ~/.firefox/add-on/JWT_secret)

.PHONY: build
build:
	web-ext build -o -i $(IGNORE_FILES)

.PHONY: sign
sign:
	web-ext sign --api-key=$(API_KEY) --api-secret=$(API_SECRET) -i $(IGNORE_FILES)

.PHONY: lint
lint:
	web-ext lint -i $(IGNORE_FILES)
