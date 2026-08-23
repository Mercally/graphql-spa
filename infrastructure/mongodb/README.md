# infrastructure/mongodb

This directory is intentionally empty for now.

The MongoDB service for this PoC is defined in the root-level
`docker-compose.yml` (single service, single named volume) — keeping it at
the repo root avoids an extra layer of indirection for a project this small.

This folder is reserved for future Mongo-specific config or scripts if the
PoC grows to need them (e.g. a `mongo-init.js` for index creation, replica
set config, etc.). Seeding data lives in `scripts/seed` (a standalone Node
script run via `npm run seed`), not here.
