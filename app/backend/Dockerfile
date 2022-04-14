FROM node:16-alpine as app_backend
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD [ "npm", "start"]
