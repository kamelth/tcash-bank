# TcashBank Queue Demo

## Slides
See `/slides/presentation.pptx` for the PowerPoint.

## Source Code
All server, client, and worker code lives in project main directiry.  
To run locally (no internet needed):
1. `docker-compose up -d`    # spins up MySQL & RabbitMQ
2. `npm install && npm run dev`  # starts Node.js + listener
3. Point your browser to `http://localhost:3000`

## Distributed Demo
- **Machine A** runs MySQL & RabbitMQ (in Docker).  
- **Machine B** runs Node.js & front‐ends, connecting to Machine A’s IP.  
- Demonstrates real‑time updates, failure retries, and metrics.

Enjoy the live demo!
