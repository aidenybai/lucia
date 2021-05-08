#!/bin/sh
YELLOW_COLOR="\u001b[33m"
RESET_COLOR="\u001b[39m"

if [[ $npm_execpath != *"yarn"* ]]; then
  printf "${YELLOW_COLOR}This repository requires Yarn 1.x for scripts to work properly.${RESET_COLOR}\n\n"
  exit 1
fi
