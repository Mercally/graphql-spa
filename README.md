# PoC — REST vs GraphQL (.NET, Node.js, Angular, React, MVC)

## 1. Overview

This is a Proof of Concept that demonstrates, on the same business domain and the same MongoDB data, why **GraphQL** can be more efficient than **REST** when data has non-trivial nested relationships — and where REST is still perfectly fine.

Domain: a small Work Management system — `Customer -> Projects -> Teams -> Users` and `Projects -> Tasks -> AssignedUser/Tags/Comments`.

Two independent backends (.NET, Node.js) each expose REST **and** GraphQL over the identical schema and the identical shared MongoDB instance. Three frontends (Angular, React, ASP.NET MVC) can each consume any backend in either mode, so any combination — e.g. "React + GraphQL against the Node backend" vs "Angular + REST against the .NET backend" — can be compared directly.

Security is intentionally out of scope for this Proof of Concept (no auth/OAuth/JWT/roles) — see Requirements.md section 23.

**Status:** every piece below has been built, compiled, and live-verified end to end (real Mongo, real seeded data, real browser checks for both frontends, real curl checks for MVC) — see `ProjectStages.md` for the verification log and the two real bugs that were found and fixed during that pass. Nothing here is unverified scaffolding.

## 2. Architecture

See [docs/architecture.md](docs/architecture.md) for the full diagram and layering explanation.

```text
                 ┌───────────────────┐
                 │     MongoDB       │
                 │     Docker        │
                 └─────────┬─────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
       ┌─────▼─────┐               ┌─────▼─────┐
       │  .NET     │               │  Node.js  │
       │ REST      │  :5000        │ REST      │  :4000
       │ GraphQL   │  /graphql     │ GraphQL   │  /graphql
       └─────┬─────┘               └─────┬─────┘
             │                           │
       ┌─────┴───────────────┬───────────┴─────┐
       │                     │                 │
 ┌─────▼─────┐         ┌─────▼─────┐    ┌────▼────┐
 │ Angular   │         │   React   │    │   MVC   │
 │ REST      │         │ REST      │    │ REST    │
 │ GraphQL   │         │ GraphQL   │    │ GraphQL │
 └───────────┘         └───────────┘    └─────────┘
```

## 3. Technologies

| Layer | Stack |
|---|---|
| Database | MongoDB 7 (Docker) |
| Backend #1 | ASP.NET Core 8 Web API — REST controllers + Hot Chocolate GraphQL, Swagger/OpenAPI, xUnit tests |
| Backend #2 | Node.js + TypeScript — Fastify (REST) + Mercurius (GraphQL), Vitest tests |
| Frontend #1 | Angular (standalone components) — HttpClient (REST) + Apollo Angular (GraphQL) |
| Frontend #2 | React + TypeScript (Vite) — TanStack Query (REST) + Apollo Client (GraphQL) |
| Frontend #3 | ASP.NET Core MVC — typed HttpClient (REST) + lightweight GraphQL-over-HTTP client |
| Infra | Docker Compose (MongoDB only) |

## 4. Requirements

- Docker + Docker Compose
- .NET 8 SDK
- Node.js 18+ and npm
- Angular CLI (`npm i -g @angular/cli`) — only needed if you want to use `ng` directly; `npm run` scripts also work

## 5. Running MongoDB

```bash
cp .env.example .env   # adjust if needed
docker compose up -d
```

This starts MongoDB on `localhost:27017` (configurable via `MONGODB_PORT`) with a named volume for persistence.

## 6. Seed

```bash
cd scripts/seed
npm install
npm run seed
```

Loads: 5 customers, 15 projects, 30 teams, 25 users, 150 tasks, ~450 comments, 10 tags — referentially consistent (every `*Id` field points at a real seeded document). Safe to re-run — it wipes and reseeds the 7 collections each time.

## 7. Running .NET backend

```bash
cd backend/dotnet/src/WorkApi
dotnet restore
dotnet run
```

- REST: `http://localhost:5000/api/...`
- GraphQL: `http://localhost:5000/graphql` (Nitro/Banana Cake Pop IDE included)
- Swagger: `http://localhost:5000/swagger`

Tests: `cd backend/dotnet && dotnet test`

## 8. Running Node.js backend

```bash
cd backend/node
npm install
npm run dev
```

- REST: `http://localhost:4000/api/...`
- GraphQL: `http://localhost:4000/graphql` (GraphiQL at `/graphiql`)

Tests: `npm test`

## 9. Running Angular

```bash
cd frontend/angular
npm install
npm start
```

Opens on `http://localhost:4200`. Use the in-app toggle to switch REST/GraphQL mode and which backend (.NET `:5000` / Node `:4000`) to target — see `frontend/angular/src/environments/` for the base URLs.

## 10. Running React

```bash
cd frontend/react
npm install
npm run dev
```

Opens on `http://localhost:5173`. Configure backend URLs via `frontend/react/.env` (copy from `frontend/react/.env.example`).

## 11. Running MVC

```bash
cd frontend/mvc/WorkMvc
dotnet restore
dotnet run
```

Runs on `http://localhost:5065` by default. Switch backend/mode per request with query string params, e.g.:

```text
http://localhost:5065/Customer?mode=rest&backend=dotnet
http://localhost:5065/Customer?mode=graphql&backend=node
```

Base URLs come from `appsettings.json` (`BackendUrls` section) or the env vars `DOTNET_API_URL`, `DOTNET_GRAPHQL_URL`, `NODE_API_URL`, `NODE_GRAPHQL_URL`.

## 12. REST examples

See [docs/api-examples.md](docs/api-examples.md) for full curl examples (CRUD, filters, status codes).

## 13. GraphQL examples

See [docs/api-examples.md](docs/api-examples.md) for queries/mutations, including the full nested `CustomerDashboard` query that is the centerpiece of this PoC.

## 14. REST vs GraphQL

See [docs/graphql-vs-rest.md](docs/graphql-vs-rest.md) — walks through the exact same nested-dashboard use case both ways: dozens of REST round-trips (over-fetching full resources, under-fetching nested data) vs one GraphQL query returning exactly the requested shape.

## 15. Project limitations

Explicitly **not** implemented (by design — this is a PoC, see Requirements.md sections 23 and 31):

- No authentication/authorization (no OAuth, OIDC, JWT, roles, Identity, MFA).
- No production-grade error monitoring/observability beyond basic logging.
- No cursor-based pagination — offset/limit only (documented decision, see [docs/graphql-vs-rest.md](docs/graphql-vs-rest.md)).
- No CI/CD pipeline — this is meant to run locally.
- No real-time subscriptions (GraphQL subscriptions were not required by the spec and are out of scope).
- Angular/React CRUD forms are implemented for the entities needed to demonstrate mutations (Customer, Task at minimum) rather than every entity — list/detail/dashboard navigation is the priority per the requirements' own stated priorities (clarity and comparability over exhaustive CRUD UI).

## Repository layout

```text
gRPC-GraphQL/
├── README.md
├── Requirements.md
├── docker-compose.yml
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── graphql-vs-rest.md
│   ├── mongodb-model.md
│   └── api-examples.md
├── infrastructure/
│   └── mongodb/
├── backend/
│   ├── dotnet/   (REST + GraphQL, Hot Chocolate)
│   └── node/     (REST + GraphQL, Fastify + Mercurius)
├── frontend/
│   ├── angular/
│   ├── react/
│   └── mvc/
└── scripts/
    └── seed/
```
