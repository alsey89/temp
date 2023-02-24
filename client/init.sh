#!/bin/sh

# Using Docker

# docker build -t paiba-client -f Dockerfile.production /home/alex/paiba/client
# docker stop paiba-client
# docker rm --force paiba-client
# docker run -d -p 4000:4000 --name paiba-client paiba-client
# docker system prune -f

# Using System

quasar build
pm2 start "quasar serve --history" --name paiba-client
