#!/bin/sh
YELLOW_COLOR="\u001b[33m"
GREEN_COLOR="\033[0;32m"
RESET_COLOR="\u001b[39m"

printf "${YELLOW_COLOR}Checking for errors...${RESET_COLOR}\n"
source scripts/check.sh
printf "${GREEN_COLOR}No errors found.${RESET_COLOR}\n"
printf "${YELLOW_COLOR}Building distribution bundles...${RESET_COLOR}\n"
source scripts/build.sh
printf "${GREEN_COLOR}Built distribution bundles.${RESET_COLOR}\n"
printf "${YELLOW_COLOR}Please run \`np\` manually to publish the package.${RESET_COLOR}"
