FROM node:13-slim
WORKDIR /var/www

RUN sudo apt-get install pg_dump pg_restore

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
