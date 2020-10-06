FROM node:13-slim
WORKDIR /var/www

# Needed for postgresql-client installation to succeed
RUN mkdir -p /usr/share/man/man1
RUN mkdir -p /usr/share/man/man7
RUN apt-get update
RUN apt-get install postgresql-client -y

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
