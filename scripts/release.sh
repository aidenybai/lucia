#!/bin/sh
YELLOW_COLOR="\u001b[33m"
GREEN_COLOR="\033[0;32m"
RESET_COLOR="\u001b[39m"
SPACER="                   "

printf "${YELLOW_COLOR}Checking for errors...${RESET_COLOR}"
source scripts/check.sh &>/dev/null || exit 1
printf "\r${GREEN_COLOR}No errors found.${RESET_COLOR}${SPACER}\n"
printf "${YELLOW_COLOR}Building distribution bundles...${RESET_COLOR}"
source scripts/build.sh &>/dev/null || exit 1
printf "\r${GREEN_COLOR}Built distribution bundles.${SPACER}${RESET_COLOR}\n${YELLOW_COLOR}Run \`np\` to publish.${RESET_COLOR}"
