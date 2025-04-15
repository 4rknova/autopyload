# Extension name and version (auto-read from manifest)
EXTENSION_NAME := autopyloader
SRC_DIR := extension
DIST_DIR := dist
MANIFEST_PATH := $(SRC_DIR)/manifest.json
BUILD_ZIP := $(EXTENSION_NAME)-$(shell jq -r .version $(MANIFEST_PATH)).zip

# Default target
all: clean build package

# Step 1: Build the extension (copy or compile)
build:
	@echo "Building extension..."
	mkdir -p $(DIST_DIR)
	rsync -av --exclude='node_modules' --exclude='*.map' --exclude='*.test.*' $(SRC_DIR)/ $(DIST_DIR)

# Step 2: Package into a zip file
package:
	@echo "Packaging extension as $(BUILD_ZIP)..."
	cd $(DIST_DIR) && zip -r ../$(BUILD_ZIP) .
	@echo "Package ready: $(BUILD_ZIP)"

# Step 3: Clean everything
clean:
	@echo "Cleaning up..."
	rm -rf $(DIST_DIR) *.zip

.PHONY: all build package clean
