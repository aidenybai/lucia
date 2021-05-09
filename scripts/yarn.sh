#!/bin/sh
RED_COLOR='\033[0;31m'
RESET_COLOR="\u001b[39m"

if [[ $npm_execpath != *"yarn"* ]]; then
  printf "${RED_COLOR}✗ Lucia requires Yarn 1.x for scripts to work properly.${RESET_COLOR}\n\n"
  exit 1
fi
