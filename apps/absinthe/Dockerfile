FROM node:13-slim
WORKDIR /var/www

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG POSTGRES_URL
RUN yarn start
