#!/bin/bash
docker kill gnosis.web
docker rm gnosis.web
docker-compose -p gnosis.web up -d