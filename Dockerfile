# Build process
FROM node:alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install --production --loglevel=error

COPY ./index.js /app/

CMD npm start
