#!/bin/bash

source $(dirname "$0")/helpers.sh

content="<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <script type=\"module\">
      import 'lucia';
    </script>
  </head>
  <body>
    <!-- Your code here -->
  </body>
</html>"

if [ ! -f index.html ]; then
  echo -e "$content" >> index.html
  info "Couldn't find an \`index.html\` file at root, creating one for you..."
fi
npx vite --host
