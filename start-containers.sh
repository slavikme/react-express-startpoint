#!/usr/bin/env bash

# Generate env files
docker-compose -f docker-compose.config.yml up

# Verify env files being created
if [[ ! -f "./db/.env" ]] || [[ ! -f "./api/.env" ]]; then
  echo "Failed to generate environment files"
  exit 1
fi

# Run the application
if [ "$1" == "dev" ]; then
  shift
  # shellcheck disable=SC2068
  docker-compose -f docker-compose-dev.yml up $@
else
  # shellcheck disable=SC2068
  docker-compose up -d $@
fi
