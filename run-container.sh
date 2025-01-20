#!/bin/bash

# run the proto-gen.sh script
./proto-gen.sh

# run the docker compose file
docker-compose down && docker-compose up --build
