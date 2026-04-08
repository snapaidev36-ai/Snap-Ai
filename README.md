# snap-ai

This repository now uses a split app structure:

- frontend: Next.js application
- backend: Fastify server

## Run both apps together

From repository root:

npm run dev

## Run frontend

From repository root:

npm run dev:frontend

Or directly:

cd frontend
npm install
npm run dev

## Run backend

From repository root:

npm run dev:backend

Or directly:

cd backend
npm install
npm run dev

## Health endpoint

The backend exposes:

GET /health

Default local URL:

http://localhost:4000/health
