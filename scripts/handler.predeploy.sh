#!/bin/bash

set -e

APP_NAME="handler"
DIST_DIR="dist/apps/$APP_NAME"
ZIP_NAME="dist/${APP_NAME}.zip"

echo "🔧 Building app with Nx..."
nx build $APP_NAME

echo "📦 Installing production dependencies..."
cp package-lock.json $DIST_DIR/
npm ci --omit=dev --prefix $DIST_DIR

echo "🗜️  Creating ZIP archive..."
cd $DIST_DIR
zip -r "../../${APP_NAME}.zip" .
cd -
