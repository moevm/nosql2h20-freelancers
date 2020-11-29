FROM node:12-alpine
WORKDIR /app
COPY ./package*.json ./
RUN apk add --update nodejs npm
RUN npm i -f
ENV MONGO_TOOLS_VERSION=4.2.1-r1
RUN apk add --no-cache mongodb-tools=${MONGO_TOOLS_VERSION} && \
    rm -rf /var/cache/apk/*
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]
