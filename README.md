# Running in development mode

## Dependencies

- docker
- docker-compose

## Command

```
docker-compose up
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
PORT=80 POSTGRES_URL=postgresql://admin:admin@postgres:5432/postgres node index.js
```

# Deploying to github

# Deploying to dockerhub
