FROM node:lts-alpine
# ENV NODE_ENV=production
# RUN mkdir -p /app
WORKDIR /app
# COPY ["./server/package.json", "./server/package-lock.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN npm install
RUN npm install -g nodemon
EXPOSE 3000
# RUN chown -R node /usr/src/app
# USER node
CMD ["nodemon", "server.js"]
