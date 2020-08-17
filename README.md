# Running in development mode

## Dependencies

- docker
- docker-compose

## Command

```
docker-compose up
docker-compose exec agora sh -c "yarn migrate:up && yarn seed"
docker-compose exec absinthe yarn start
```

# Building the app

## Dependencies

docker
tar
zip

## Command

```
make build
```

# Running in production mode

## Dependencies

postgres@9.5
node@13

## Command

```
yarn migrate:up &&
SECRET=secret_phrase PORT=80 DATABASE_URL=postgresql://admin:admin@postgres:5432/postgres node app/index.js
```

# Deploying to github

# Deploying to dockerhub
