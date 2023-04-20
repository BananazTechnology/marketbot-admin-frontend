FROM nginx:alpine

#  Install app
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./src /usr/share/nginx/html

# Install scripts
COPY ./scripts /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/BuildJSVarFromENV.sh