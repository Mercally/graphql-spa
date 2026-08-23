# MongoDB Data Model

All entities stored as separate collections. Relationships resolved via ObjectId references.

## Collections

### customers
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  createdAt: Date
}
```

### projects
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  customerId: ObjectId (ref: customers),
  status: String,  // "NotStarted" | "InProgress" | "Completed" | "OnHold"
  createdAt: Date,
  updatedAt: Date
}
```

### teams
```javascript
{
  _id: ObjectId,
  name: String,
  projectId: ObjectId (ref: projects),
  memberUserIds: [ObjectId] (ref: users),
  createdAt: Date
}
```

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: String,  // "Developer" | "Manager" | "Designer" | "QA"
  createdAt: Date
}
```

### tasks
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  projectId: ObjectId (ref: projects),
  status: String,  // "Todo" | "InProgress" | "InReview" | "Done"
  assignedUserId: ObjectId (ref: users),
  tagIds: [ObjectId] (ref: tags),
  createdAt: Date,
  updatedAt: Date
}
```

### tags
```javascript
{
  _id: ObjectId,
  name: String,
  color: String,  // hex color for UI
  createdAt: Date
}
```

### comments
```javascript
{
  _id: ObjectId,
  text: String,
  taskId: ObjectId (ref: tasks),
  userId: ObjectId (ref: users),
  createdAt: Date
}
```

## Design Decisions

1. **All entities are separate collections** — maximizes query flexibility and lets both REST and GraphQL navigate relationships via references.
2. **Comments are NOT embedded** in tasks because they are independently queryable (list all comments by a user, etc.) and grow unboundedly.
3. **Tags are separate** and referenced by `tagIds` array in tasks — tags are reusable across tasks.
4. **Teams store memberUserIds** as an array — avoids needing a join collection for team memberships.
5. **Indexes**: createdAt, customerId, projectId, assignedUserId, status for frequent queries.
