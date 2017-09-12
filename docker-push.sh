#! /bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t scoring-guide .
docker tag scoring-guide:latest osucass/scoring-guide:ci-test
docker push osucass/scoring-guide:ci-test