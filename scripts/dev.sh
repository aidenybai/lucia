#!/bin/bash

content="<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <script type=\"module\">
      import { init, component } from 'lucia';
      init();
    </script>
  </head>
  <body>
    <!-- Your code here -->
  </body>
</html>"
BLUE_COLOR='\033[0;34m'
RESET_COLOR="\u001b[39m"

if [ ! -f index.html ]; then
  echo -e "$content" >> index.html
  printf "${BLUE_COLOR}ⓘ Couldn't find an \`index.html\` file at root, creating one for you..${RESET_COLOR}\n"
fi
npx vite --host
