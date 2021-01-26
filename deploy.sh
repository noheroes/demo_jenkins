#!/bin/bash
docker kill gnosis.web
docker rm gnosis.web
docker network create ms
docker-compose -p gnosis.web up -d
