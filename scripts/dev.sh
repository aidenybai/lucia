content="<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <script type=\"module\">
      import { init, component } from './src/index.ts';
      init();
    </script>
  </head>
  <body>
    <!-- Your code here -->
  </body>
</html>"

#!/bin/sh
if [ ! -f index.html ]; then
  echo -e "$content" >> index.html
fi
npx vite --host
