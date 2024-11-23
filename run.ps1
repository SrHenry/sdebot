# Run a Docker container named diario-seduc-bot with a volume mapping and using the node:21-slim image
docker run --rm --name diario-seduc-bot -v ${PWD}:/app -w /app node:22-slim $args
