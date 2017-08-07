
PACKAGE_FILES = background.js content.js icons/* manifest.json options/* LICENSE README.md
PACKAGE_ARCHIVE = package/autoscroll.zip
PACKAGE_DIR = package

.PHONY: package
package:
	mkdir -p $(PACKAGE_DIR)
	zip $(PACKAGE_ARCHIVE) $(PACKAGE_FILES)

.PHONY: remove_package
remove_package:
	rm -f $(PACKAGE_ARCHIVE)
