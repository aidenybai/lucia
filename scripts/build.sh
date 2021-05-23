#!/bin/bash

rm -rf dist
rollup -c

# Unify types into one file
mv dist/types/lucia.d.ts dist/lucia.d.ts
rm -rf dist/types
