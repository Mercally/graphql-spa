# REST vs GraphQL — the actual comparison

This is the core point of the PoC. Both backends expose the identical use case two ways; this doc shows the real difference, reproducible against the seeded data.

## The scenario

Render this nested view for one customer:

```text
Customer
  -> Projects
      -> Tasks
          -> AssignedUser
          -> Tags
          -> Comments
      -> Teams
          -> Users
```

## REST: multiple requests, over-fetching or under-fetching

REST resources are shaped around the server's model, not the client's screen. To build the view above you must walk the graph yourself, one request per hop:

```text
GET /api/customers/{customerId}
GET /api/projects?customerId={customerId}
GET /api/tasks?projectId={projectId}          (repeated per project)
GET /api/users/{assignedUserId}               (repeated per task)
GET /api/tags/{tagId}                         (repeated per tag per task)
GET /api/comments?taskId={taskId}             (repeated per task)
GET /api/teams?projectId={projectId}          (repeated per project)
GET /api/users/{memberUserId}                 (repeated per team member)
```

For a customer with 3 projects, 10 tasks each, 2 teams each: that's 1 (customer) + 3 (projects) + 3×10 (tasks) + up to 30 (assigned users) + tag lookups + comment lookups + 6 (teams) + team member lookups — **dozens of round trips** for one screen. This is **under-fetching** (each response alone isn't enough, you must chain more requests to get the full picture).

The opposite problem also shows up: `GET /api/tasks?projectId=...` returns every field of every task (title, description, timestamps, all IDs) even if the screen only needs `title` and `status` — that's **over-fetching**.

Try it yourself (either backend, same shape):

```bash
curl http://localhost:5000/api/customers/<id>
curl "http://localhost:5000/api/projects?customerId=<id>"
curl "http://localhost:5000/api/tasks?projectId=<id>"
```

## GraphQL: one request, exact shape

The client describes exactly the shape it wants, once:

```graphql
query CustomerDashboard($customerId: ID!) {
  customer(id: $customerId) {
    id
    name
    projects {
      id
      name
      tasks {
        id
        title
        status
        assignedUser { id name }
        tags { id name }
        comments { id text }
      }
      teams {
        id
        name
        users { id name }
      }
    }
  }
}
```

One HTTP request. The response contains exactly these fields, nothing more, no matter how deep the nesting — no over-fetching, no under-fetching, no client-side orchestration of follow-up calls.

```bash
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query($id:ID!){ customer(id:$id){ id name projects { id name tasks { id title status assignedUser{id name} tags{id name} comments{id text} } teams { id name users{id name} } } } }","variables":{"id":"<customerId>"}}'
```

## What this demonstrates

| | REST | GraphQL |
|---|---|---|
| Requests for the full nested dashboard | ~7–40+ depending on fan-out | 1 |
| Response shape | Fixed by the server per endpoint | Chosen by the client per query |
| Over-fetching | Yes (full resource returned even if 2 fields needed) | No (only requested fields returned) |
| Under-fetching | Yes (must chain more requests for nested data) | No (nested data included in one response) |
| Client flexibility | Low — new UI need often means a new endpoint | High — same schema serves any shape the client asks for |
| Server complexity | Simple per-endpoint handlers | Resolver graph must be designed carefully (N+1 query risk) |

Both frontends (Angular, React) implement a small request-count panel in their dashboard view specifically to make the request-count difference above visible and real, not just asserted — the counts in the UI come from the browser's actual network activity, not a hardcoded number.

## Filtering and pagination

Both paradigms support filtering and pagination in this PoC:

- REST: query-string filters, e.g. `GET /api/tasks?status=InProgress&projectId=<id>&page=1&pageSize=20`.
- GraphQL: field arguments, e.g. `tasks(status: "InProgress", projectId: "<id>", offset: 0, limit: 20)`.

Pagination uses **offset/limit** on both backends and both paradigms — simplest standard approach sufficient for this PoC's data volumes (see [mongodb-model.md](mongodb-model.md) and Requirements.md section 17 for why cursor-based pagination wasn't needed here).

## No invented benchmarks

The request counts above are structural (counting round trips required by the access pattern), not timed benchmarks. If you want real latency numbers, use your browser's network tab or `curl -w "%{time_total}\n"` against the running backends — any numbers you measure yourself are more honest than anything hardcoded here.
