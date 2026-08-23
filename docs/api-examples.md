# API Examples

Both backends (.NET on `:5000`, Node on `:4000`) expose the identical shape. Examples below use the .NET backend; swap the port to hit Node.

## REST

### Customers

```bash
# List
curl http://localhost:5000/api/customers

# Get one
curl http://localhost:5000/api/customers/<id>

# Create
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","email":"contact@acme.test"}'
# -> 201 Created

# Update
curl -X PUT http://localhost:5000/api/customers/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corporation"}'
# -> 200 OK

# Delete
curl -X DELETE http://localhost:5000/api/customers/<id>
# -> 204 No Content

# Not found
curl -i http://localhost:5000/api/customers/000000000000000000000000
# -> 404 Not Found
```

### Tasks with filters

```bash
curl "http://localhost:5000/api/tasks?status=InProgress&projectId=<id>&page=1&pageSize=20"
```

Same CRUD shape applies to `/api/projects`, `/api/teams`, `/api/users`, `/api/tags`, `/api/comments`.

### Status codes used

| Code | Meaning |
|---|---|
| 200 | Successful GET/PUT |
| 201 | Successful POST (Location header points at the new resource) |
| 204 | Successful DELETE |
| 400 | Validation error (bad payload, invalid filter value) |
| 404 | Resource not found |
| 500 | Unhandled server error (no stack trace exposed to the client) |

## GraphQL

Explore interactively at `http://localhost:5000/graphql` (.NET, Nitro/Banana Cake Pop IDE) or `http://localhost:4000/graphiql` (Node, GraphiQL).

### Query: single customer, flat

```graphql
query {
  customer(id: "<id>") {
    id
    name
    email
  }
}
```

### Query: full nested dashboard (the headline demo)

```graphql
query CustomerDashboard($id: ID!) {
  customer(id: $id) {
    id
    name
    projects {
      id
      name
      status
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

Variables:

```json
{ "id": "<customerId>" }
```

### Query: filtered + paginated tasks

```graphql
query {
  tasks(status: "InProgress", projectId: "<id>", offset: 0, limit: 20) {
    id
    title
    status
  }
}
```

### Mutation: create customer

```graphql
mutation {
  createCustomer(input: { name: "Acme Corp", email: "contact@acme.test" }) {
    id
    name
  }
}
```

### Mutation: update task

```graphql
mutation {
  updateTask(id: "<id>", input: { status: "Done" }) {
    id
    status
  }
}
```

### Mutation: delete project

```graphql
mutation {
  deleteProject(id: "<id>")
}
```

### Error shape

GraphQL errors follow the standard `errors[]` array in the response body, each with a `message` and, where relevant, `path` — no stack traces are exposed. REST errors return a consistent JSON body: `{ "error": { "message": "...", "statusCode": 404 } }`.

## Trying both backends against the same data

Because both backends read the same MongoDB, the same `<id>` values work on either port — a good way to see for yourself the API paradigm is what differs, not the underlying data:

```bash
curl http://localhost:5000/api/customers/<id>   # .NET
curl http://localhost:4000/api/customers/<id>   # Node — same document
```
