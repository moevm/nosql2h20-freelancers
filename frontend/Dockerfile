FROM node:12-alpine AS builder
RUN npm install -g http-server
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 8080
USER node
CMD [ "http-server", "dist" ]
