#!/bin/bash
docker-compose down
docker kill gnosis.web
#docker rm gnosis.web
docker network create ms
docker-compose -p gnosis.web up -d
sleep 10
docker-compose down
docker system prune -f
