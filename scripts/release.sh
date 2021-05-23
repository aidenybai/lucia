#!/bin/bash

YELLOW_COLOR="\u001b[33m"
GREEN_COLOR="\033[0;32m"
RED_COLOR='\033[0;31m'
BLUE_COLOR='\033[0;34m'
RESET_COLOR="\u001b[39m"
SPACER="                   "

function fail {
  printf "\r${RED_COLOR}✗ Error during $1. Run \`$2\`.${RESET_COLOR}\n";
  exit 1;
}

printf "${YELLOW_COLOR}⚠ Checking for errors...${RESET_COLOR}"
source scripts/check.sh &>/dev/null || fail "checks" "sh scripts/check.sh"
printf "\r${GREEN_COLOR}✓ No errors found.${RESET_COLOR}${SPACER}\n"
printf "${YELLOW_COLOR}⚠ Building distribution bundles...${RESET_COLOR}"
source scripts/check.sh &>/dev/null || fail "build" "yarn build"
printf "\r${GREEN_COLOR}✓ Built distribution bundles.${SPACER}${RESET_COLOR}\n${BLUE_COLOR}ⓘ Run \`np\` to publish.${RESET_COLOR}\n"
