FROM node:16-alpine
WORKDIR /app
COPY . .
# RUN npm install -g @vue/cli
RUN npm i -g @quasar/cli
RUN npm install
EXPOSE 8080
CMD ["quasar", "dev"]
