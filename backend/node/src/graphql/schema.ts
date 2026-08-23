/**
 * GraphQL SDL for the PoC.
 *
 * Pagination: simple offset/limit on every top-level list field (per
 * Requirements.md section 17 — "no need for complex solution", so cursor-based
 * pagination was intentionally skipped in favor of `limit`/`offset` args).
 */
export const schema = `
  enum ProjectStatus {
    NotStarted
    InProgress
    Completed
    OnHold
  }

  enum UserRole {
    Developer
    Manager
    Designer
    QA
  }

  enum TaskStatus {
    Todo
    InProgress
    InReview
    Done
  }

  type Customer {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    projects(limit: Int, offset: Int): [Project!]!
  }

  type Project {
    id: ID!
    name: String!
    description: String!
    customerId: ID!
    status: ProjectStatus!
    createdAt: String!
    updatedAt: String!
    customer: Customer
    tasks(status: TaskStatus, limit: Int, offset: Int): [Task!]!
    teams(limit: Int, offset: Int): [Team!]!
  }

  type Team {
    id: ID!
    name: String!
    projectId: ID!
    memberUserIds: [ID!]!
    createdAt: String!
    project: Project
    users: [User!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    createdAt: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    projectId: ID!
    status: TaskStatus!
    assignedUserId: ID
    tagIds: [ID!]!
    createdAt: String!
    updatedAt: String!
    project: Project
    assignedUser: User
    tags: [Tag!]!
    comments(limit: Int, offset: Int): [Comment!]!
  }

  type Tag {
    id: ID!
    name: String!
    color: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    text: String!
    taskId: ID!
    userId: ID!
    createdAt: String!
    task: Task
    user: User
  }

  type TaskPage {
    items: [Task!]!
    total: Int!
  }

  type Query {
    customers(limit: Int, offset: Int): [Customer!]!
    customer(id: ID!): Customer

    projects(customerId: ID, limit: Int, offset: Int): [Project!]!
    project(id: ID!): Project

    teams(projectId: ID, limit: Int, offset: Int): [Team!]!
    team(id: ID!): Team

    users(limit: Int, offset: Int): [User!]!
    user(id: ID!): User

    tasks(status: TaskStatus, projectId: ID, limit: Int, offset: Int): TaskPage!
    task(id: ID!): Task

    tags(limit: Int, offset: Int): [Tag!]!
    tag(id: ID!): Tag

    comments(taskId: ID, limit: Int, offset: Int): [Comment!]!
    comment(id: ID!): Comment
  }

  input CreateCustomerInput {
    name: String!
    email: String!
  }
  input UpdateCustomerInput {
    name: String
    email: String
  }

  input CreateProjectInput {
    name: String!
    description: String
    customerId: ID!
    status: ProjectStatus!
  }
  input UpdateProjectInput {
    name: String
    description: String
    customerId: ID
    status: ProjectStatus
  }

  input CreateTeamInput {
    name: String!
    projectId: ID!
    memberUserIds: [ID!]
  }
  input UpdateTeamInput {
    name: String
    memberUserIds: [ID!]
  }

  input CreateUserInput {
    name: String!
    email: String!
    role: UserRole!
  }
  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
  }

  input CreateTaskInput {
    title: String!
    description: String
    projectId: ID!
    status: TaskStatus!
    assignedUserId: ID
    tagIds: [ID!]
  }
  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    assignedUserId: ID
    tagIds: [ID!]
  }

  input CreateTagInput {
    name: String!
    color: String!
  }
  input UpdateTagInput {
    name: String
    color: String
  }

  input CreateCommentInput {
    text: String!
    taskId: ID!
    userId: ID!
  }
  input UpdateCommentInput {
    text: String
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
    updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): Boolean!

    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    createTeam(input: CreateTeamInput!): Team!
    updateTeam(id: ID!, input: UpdateTeamInput!): Team!
    deleteTeam(id: ID!): Boolean!

    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!

    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!

    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;
