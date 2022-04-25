FROM node:16-alpine as app_backend

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT [ "npm", "start"]
