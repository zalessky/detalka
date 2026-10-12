#!/bin/sh
# Update of the "detalka" test site on the NAS (Synology DSM).
# Copy this file to /volume1/docker/detalka/update.sh and run it from Task Scheduler as root:
#   sh /volume1/docker/detalka/update.sh
# Pulls ghcr.io/zalessky/detalka:latest and recreates the container only if the image changed.
# Log: /volume1/docker/detalka/update.log (last 500 lines are kept)

cd /volume1/docker/detalka || exit 1
export PATH="$PATH:/usr/local/bin"
P=detalka   # Container Manager project name
if docker compose version >/dev/null 2>&1; then DC="docker compose -p $P"; else DC="docker-compose -p $P"; fi
{
  echo "=== $(date '+%F %T')"
  # safety: do not create a second set of containers if the project name does not match
  if [ -z "$($DC ps -a -q)" ]; then
    echo "Project $P not found - check P= in the script. Nothing done."
    exit 1
  fi
  $DC pull && $DC up -d --remove-orphans
  # remove only old (untagged) detalka images; rolf64 and other images are not touched
  docker image prune -f --filter "label=org.opencontainers.image.source=https://github.com/zalessky/detalka"
} >> update.log 2>&1

# keep the log short
tail -n 500 update.log > update.log.tmp && mv update.log.tmp update.log
