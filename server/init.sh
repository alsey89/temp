#!/bin/sh


#Using Docker

# docker build -t paiba-server -f Dockerfile.production /home/alex/paiba/server
# docker stop paiba-server
# docker rm --force paiba-server
# docker run -d -p 3000:3000 --name paiba-server paiba-server
# docker system prune -f

#Using host system
pm2 start server.js --name paiba-server