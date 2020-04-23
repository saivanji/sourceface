FROM node:13-slim
WORKDIR /var/www

COPY package.json yarn.lock ./
COPY ./packages ./packages
RUN yarn install