# Project Stages — REST vs GraphQL PoC

## Status Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Completed
- ❌ Blocked

---

## Phase 0: Infrastructure

| # | Task | Status |
|---|------|--------|
| 0.1 | Create folder structure | ✅ |
| 0.2 | docker-compose.yml (MongoDB) | ✅ |
| 0.3 | MongoDB model design doc | ✅ |
| 0.4 | Seed script | ✅ (standalone `npm run seed`, verified against real Mongo, idempotent) |

---

## Phase 1: .NET Backend

| # | Task | Status |
|---|------|--------|
| 1.1 | Project setup (.NET 8 Web API + solution) | ✅ |
| 1.2 | Domain models + MongoDB driver setup | ✅ |
| 1.3 | Repositories (all 7 entities) | ✅ |
| 1.4 | REST controllers (CRUD all entities) | ✅ |
| 1.5 | Hot Chocolate GraphQL schema + types | ✅ |
| 1.6 | GraphQL resolvers + mutations | ✅ |
| 1.7 | Filters, pagination, CORS | ✅ (offset/limit) |
| 1.8 | Swagger/OpenAPI config | ✅ |
| 1.9 | Unit + integration tests | ✅ (8/8 passing) |
| 1.10 | appsettings + env vars config | ✅ |

Verified: `dotnet build` 0 errors/warnings, `dotnet test` 8/8 pass, live REST+GraphQL smoke test against seeded Mongo confirmed.

---

## Phase 2: Node.js Backend

| # | Task | Status |
|---|------|--------|
| 2.1 | Project setup (Fastify + TypeScript) | ✅ |
| 2.2 | Domain models + MongoDB driver setup | ✅ |
| 2.3 | Repositories (all 7 entities) | ✅ |
| 2.4 | REST routes (CRUD all entities) | ✅ |
| 2.5 | Mercurius GraphQL schema + resolvers | ✅ |
| 2.6 | Mutations, filters, pagination | ✅ (offset/limit) |
| 2.7 | Tests | ✅ (15/15 passing, Vitest) |
| 2.8 | CORS, env config | ✅ |

Verified: `npm run build` clean, `npm test` 15/15 pass, live smoke test (REST CRUD + nested GraphQL query) against seeded Mongo confirmed.

---

## Phase 3: Frontends

| # | Task | Status |
|---|------|--------|
| 3.1 | Angular: setup, REST client, GraphQL Apollo client | ✅ |
| 3.2 | Angular: dashboard, entity screens, REST vs GraphQL toggle | ✅ |
| 3.3 | React: setup (Vite + TypeScript + TanStack Query/Apollo) | ✅ |
| 3.4 | React: dashboard, entity screens, REST vs GraphQL toggle | ✅ |
| 3.5 | MVC: setup (ASP.NET Core MVC) | ✅ |
| 3.6 | MVC: REST + GraphQL controllers, views | ✅ |

Verified live in a real browser (chrome-devtools) against real seeded data, both backends, both modes:
- Angular dashboard: GraphQL = 1 request, REST = 179–182 requests for the same nested tree (Customer→Projects→Teams/Users→Tasks→AssignedUser/Tags/Comments). Toggling REST/GraphQL/backend now auto-refetches (fixed — was stale until the customer/mode/backend actually changed).
- React dashboard: GraphQL = 1 request, REST = 64 requests (fewer than Angular's because of user/tag de-dup caching within a single run — a deliberate, documented difference); request log shows real URLs. `App.tsx` and `DashboardPage.tsx` had to be built/wired from scratch (the build agent had scaffolded everything else — hooks, API clients, all list/detail pages — but never wired routing or built the dashboard page itself).
- MVC: Customer/Project detail pages verified via curl against both .NET and Node backends, both `?mode=rest` and `?mode=graphql`, real nested data confirmed.

Bugs found only by live verification (not visible from source alone) and fixed:
- **.NET GraphQL**: every `id`-shaped argument/field was typed `String`/`StringType` instead of `ID`/`IdType` (schema-wide, `QueryType.cs`/`MutationType.cs`/all `GraphQL/*Type.cs` files) — broke every variable-based query (`$id: ID!` sent by Apollo clients got rejected as incompatible with the server's `String!`). Fixed by switching all id-like args/fields to `IdType`.
- **Node GraphQL**: `Team.users` and `Task.tags` resolvers returned raw Mongo documents instead of calling `mapUser`/`mapTag` — crashed with "Cannot return null for non-nullable field User.id" the moment a team or a task's tags were queried through the nested dashboard. Fixed by adding the missing `.map(mapUser)` / `.map(mapTag)`.

---

## Phase 4: Documentation & Polish

| # | Task | Status |
|---|------|--------|
| 4.1 | README.md (full setup guide) | ✅ |
| 4.2 | docs/architecture.md | ✅ |
| 4.3 | docs/graphql-vs-rest.md | ✅ |
| 4.4 | docs/mongodb-model.md | ✅ |
| 4.5 | docs/api-examples.md | ✅ |
| 4.6 | Integration verification (full stack, all combinations) | ✅ live-verified in browser + curl, see Phase 3 notes |

## Known gaps (honest, for whoever resumes)

- Node backend GraphQL/REST resolvers have unit/integration test coverage for services and REST routes, but not for the GraphQL resolver layer specifically — the two bugs above were only caught by live browser verification, not by the existing test suite. Worth adding resolver-level tests if you touch that file again.
- MVC only has `Index`/`Details` views for the entities the requirements call out as minimum (Customer list/detail, Project detail, Task list) plus `Details` for Team/User reached via links — no MVC screens for Tag/Comment or Team/User list pages. This matches Requirements.md §12's stated minimum, not a full CRUD UI.
- Angular's request-count panel is a plain incrementing counter; React's shows the actual list of URLs/operations (more informative). Both are real, live-measured counts — not hardcoded — just different presentation depth.
