# Run a Docker container named diario-seduc-bot with a volume mapping and using the node:23-slim image
docker run --rm --name diario-seduc-bot -v ${PWD}:/app -w /app node:23-slim $args
