
PACKAGE_FILES = background.js button/* content.js icons/* manifest.json
PACKAGE_ARCHIVE = package/autoscroll.zip

.PHONY: package
package:
	zip $(PACKAGE_ARCHIVE) $(PACKAGE_FILES)

.PHONY: remove_package
remove_package:
	rm -f $(PACKAGE_ARCHIVE)
