#!/bin/sh
# Alpine image does not have bash so the shebang is /bin/sh

# The location of webpage variables file
VAR_FILE=/usr/share/nginx/html/resources/global.js

# Add additional append before running variables to ensure newline
echo "" >> $VAR_FILE

# Loop all ENV
while IFS='=' read -r -d '' key value; do

    # Do a check on the envvar name to ensure we dont leak sensitive data
    if [[ "$key" =~ .*"APP".* ]]; then

        # Append ENV K/V in $VAR_FILE
        echo "let $key = \"$value\";" >> $VAR_FILE
    fi
done < <(env -0)

echo "[BuildJSVarFromENV] Completed writing vars to Javascript"