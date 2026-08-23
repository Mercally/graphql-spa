# Architecture

## Overview

This PoC exposes one business domain — a small Work Management system (Customer → Projects → Teams/Tasks) — through **two independent backend stacks** (.NET and Node.js), each implementing the **same REST API shape** and the **same GraphQL schema**, both reading/writing **one shared MongoDB instance**. Three frontends (Angular, React, ASP.NET MVC) consume either backend, in either REST or GraphQL mode, so any combination can be compared side by side.

```text
                 ┌───────────────────┐
                 │     MongoDB       │
                 │   (Docker, 1 DB)  │
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

## Why two backends on one database

The point of the PoC is to compare **REST vs GraphQL**, not .NET vs Node. Running both stacks against the same MongoDB proves the comparison is about the API paradigm, not about which language/framework happens to implement it — a query that needs N REST round-trips or 1 GraphQL query behaves the same way regardless of which backend answers it.

## Layering (both backends)

Both backends follow the same three-layer shape so REST and GraphQL never duplicate business logic:

```text
Controllers/Routes (REST)  ─┐
                             ├──> Services ──> Repositories ──> MongoDB
GraphQL Resolvers          ─┘
```

- **Repositories**: one per collection, raw MongoDB driver access only (find/insert/update/delete), no business rules.
- **Services**: validation, cross-entity checks (e.g. a task's `assignedUserId`/`tagIds`/`projectId` must reference real documents), the single source of truth for behavior.
- **REST controllers/routes** and **GraphQL resolvers** are both thin — they call the same services and only handle transport concerns (HTTP status codes vs GraphQL error formatting).

| Concern | .NET | Node.js |
|---|---|---|
| REST | ASP.NET Core Controllers | Fastify routes |
| GraphQL | Hot Chocolate | Mercurius |
| Mongo access | `MongoDB.Driver` | `mongodb` npm driver |
| DTOs/validation | C# DTOs + data annotations | TypeScript interfaces + service-level checks |
| Tests | xUnit (unit + `WebApplicationFactory` integration) | Vitest (unit + Fastify `inject()` integration) |

## Data model

See [mongodb-model.md](mongodb-model.md) for the full collection schema and the reasoning behind it (why entities are separate collections, why comments aren't embedded, etc).

## Frontends

All three frontends implement **two parallel, non-mixed data-access layers** — a REST client and a GraphQL client — selectable at runtime, and both point at a configurable backend base URL (.NET or Node). This lets any frontend demonstrate the REST-vs-GraphQL difference regardless of which backend answers it.

| Frontend | REST client | GraphQL client |
|---|---|---|
| Angular | `HttpClient` services | Apollo Angular |
| React | `fetch` + TanStack Query | Apollo Client |
| ASP.NET MVC | Typed `HttpClient` | Lightweight GraphQL-over-HTTP client |

MVC never touches MongoDB directly — it is a pure HTTP client of the backends, same as Angular/React, per the requirement that all UI layers go through the API.

## Configuration

Nothing is hardcoded. All connection strings and base URLs come from environment variables — see [.env.example](../.env.example) at the repo root and each app's own `.env`/`appsettings.json`/`environment.ts` for how that translates per stack.

## Out of scope

Security (auth, roles, OAuth/OIDC/JWT/MFA) is intentionally not implemented — see [Requirements.md](../Requirements.md) section 23. This is a Proof of Concept for API-paradigm comparison, not a production system.
