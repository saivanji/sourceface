#!/bin/sh
export NODE_ENV=production
export PORT=80
# get from git version
export APP_VERSION=0.0.1

TEMP_DIR=./temp
rm -rf $TEMP_DIR
rm -f sourceface-*.zip
rm -f sourceface-*.tar.gz

docker build \
  --build-arg NODE_ENV \
  --build-arg PORT \
  -t sourceface-agora apps/agora
docker build --build-arg NODE_ENV -t sourceface-sunwell apps/sunwell

AGORA_ID=$(docker container create sourceface-agora)
SUNWELL_ID=$(docker container create sourceface-sunwell)
mkdir $TEMP_DIR

for ITEM in build/index.js package.json yarn.lock migrations postgres.js
do
  docker container cp $AGORA_ID:/var/www/$ITEM $TEMP_DIR
done
docker container cp $SUNWELL_ID:/var/www/build $TEMP_DIR/public

tar -zcvf ./sourceface-$APP_VERSION.tar.gz $TEMP_DIR
zip -r ./sourceface-$APP_VERSION.zip $TEMP_DIR

docker container rm -f $AGORA_ID
docker container rm -f $SUNWELL_ID
rm -rf $TEMP_DIR