FROM node
WORKDIR /var/www

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
