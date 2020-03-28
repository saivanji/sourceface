FROM node:13-slim
WORKDIR /var/www

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG PORT
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ] ; then yarn build ; fi