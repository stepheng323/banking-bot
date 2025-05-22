#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide the zip file name (e.g., handler.zip)"
    exit 1
fi

echo "📦 Checking contents of $1..."
unzip -l "dist/$1"
