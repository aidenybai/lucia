#!/bin/bash

source $(dirname "$0")/helpers.sh

rm -rf dist
rollup -c rollup.config.ts
mv dist/types/lucia.d.ts dist/lucia.d.ts
rm -rf dist/types

info "Dist: `ls -xm -d dist/*`"
