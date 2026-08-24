// Seed script for MongoDB
// Run via: npm run seed  (from scripts/seed, after `npm install`)
// Connects with the mongodb driver, wipes the 7 target collections, then
// (re)inserts sample data in referential order:
//   customers -> projects -> teams -> users -> tasks -> tags -> comments
//
// Generates: 5 Customers, each with 3 Projects, each with 2 Teams + 10 Tasks,
// 25 Users, 10 reusable Tags, and 1-5 Comments per Task.
//
// Env vars (with localhost defaults for local dev):
//   MONGODB_CONNECTION_STRING  (default: mongodb://localhost:27017)
//   MONGODB_DATABASE           (default: workmanagement)

const { MongoClient } = require("mongodb");

const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "workmanagement";

function buildData() {
  const users = [];
  const tagPool = [];
  const customers = [];
  const projects = [];
  const teams = [];
  const tasks = [];
  const comments = [];

  // ── Users ────────────────────────────────────────────────────────
  const roles = ["Developer", "Manager", "Designer", "QA"];
  const firstNames = [
    "Alice", "Bob", "Carol", "Dave", "Eve",
    "Frank", "Grace", "Hank", "Ivy", "Jack",
    "Karen", "Leo", "Mona", "Nick", "Olivia",
    "Paul", "Quinn", "Rita", "Sam", "Tina",
    "Uma", "Victor", "Wendy", "Xavier", "Yara",
  ];
  for (let i = 0; i < 25; i++) {
    users.push({
      name: firstNames[i],
      email: `${firstNames[i].toLowerCase()}@mailinator.com`,
      role: roles[i % roles.length],
      createdAt: new Date(),
    });
  }

  // ── Tags ─────────────────────────────────────────────────────────
  const tagDefs = [
    { name: "Bug", color: "#e74c3c" },
    { name: "Feature", color: "#3498db" },
    { name: "Enhancement", color: "#2ecc71" },
    { name: "Documentation", color: "#9b59b6" },
    { name: "Refactor", color: "#f39c12" },
    { name: "Testing", color: "#1abc9c" },
    { name: "Urgent", color: "#e67e22" },
    { name: "Research", color: "#34495e" },
    { name: "UI", color: "#16a085" },
    { name: "Backend", color: "#2c3e50" },
  ];
  tagDefs.forEach((t) => {
    tagPool.push({ name: t.name, color: t.color, createdAt: new Date() });
  });

  // ── Customers ────────────────────────────────────────────────────
  const customerNames = [
    "Acme Corp", "Globex Inc", "Initech LLC", "Soylent Corp", "Umbrella Inc",
  ];
  customerNames.forEach((name) => {
    customers.push({
      name,
      email: `contact@${name.toLowerCase().replace(/ /g, "")}.com`,
      createdAt: new Date(),
    });
  });

  // ── Projects / Teams / Tasks / Comments ─────────────────────────
  const projectNames = [
    ["Web Redesign", "Mobile App", "Analytics Dashboard"],
    ["Cloud Migration", "API Gateway", "Data Pipeline"],
    ["CRM System", "Inventory Tracker", "Reporting Tool"],
    ["E-commerce Platform", "Landing Page", "Payment Gateway"],
    ["IoT Dashboard", "Firmware Updater", "Sensor Analytics"],
  ];
  const statuses = ["InProgress", "InProgress", "Completed", "NotStarted", "OnHold"];
  const taskStatuses = [
    "Todo", "InProgress", "InReview", "Done", "InProgress",
    "Todo", "Done", "InReview", "InProgress", "Todo",
  ];

  let userCounter = 0;
  for (let c = 0; c < customers.length; c++) {
    for (let p = 0; p < 3; p++) {
      const project = {
        customerIndex: c, // resolved to a real ObjectId after customers are inserted
        name: projectNames[c][p],
        description: `Project ${projectNames[c][p]} for ${customers[c].name}`,
        status: statuses[p],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const projectIndex = projects.push(project) - 1;

      // ── Teams (2 per project) ────────────────────────────────────
      const teamMemberCount = 3 + Math.floor(Math.random() * 3);
      const memberIndexes = [];
      for (let m = 0; m < teamMemberCount; m++) {
        memberIndexes.push(userCounter % users.length);
        userCounter++;
      }
      teams.push(
        {
          name: `${project.name} - Team Alpha`,
          projectIndex,
          memberUserIndexes: [...memberIndexes],
          createdAt: new Date(),
        },
        {
          name: `${project.name} - Team Beta`,
          projectIndex,
          memberUserIndexes: [...new Set(memberIndexes)],
          createdAt: new Date(),
        }
      );

      // ── Tasks (10 per project) ───────────────────────────────────
      for (let t = 0; t < 10; t++) {
        const assignedUserIndex = userCounter % users.length;
        userCounter++;
        const numTags = 2 + Math.floor(Math.random() * 3); // 2-4 tags
        const tagIndexes = [];
        for (let tg = 0; tg < numTags; tg++) {
          tagIndexes.push(tg % tagPool.length);
        }

        const task = {
          title: `Task ${t + 1} for ${project.name}`,
          description: `Description for task ${t + 1} under project ${project.name}`,
          projectIndex,
          status: taskStatuses[t],
          assignedUserIndex,
          tagIndexes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const taskIndex = tasks.push(task) - 1;

        // ── Comments (1-5 per task) ────────────────────────────────
        const numComments = 1 + Math.floor(Math.random() * 5);
        for (let cm = 0; cm < numComments; cm++) {
          const commentUserIndex = userCounter % users.length;
          userCounter++;
          comments.push({
            text: `Comment ${cm + 1} by ${users[commentUserIndex].name} on task ${t + 1}`,
            taskIndex,
            userIndex: commentUserIndex,
            createdAt: new Date(),
          });
        }
      }
    }
  }

  return { users, tagPool, customers, projects, teams, tasks, comments };
}

async function seed() {
  const { users, tagPool, customers, projects, teams, tasks, comments } = buildData();

  const client = new MongoClient(MONGODB_CONNECTION_STRING);
  await client.connect();
  const db = client.db(MONGODB_DATABASE);

  try {
    // Wipe the collections we're about to reseed so the script is idempotent.
    const collectionNames = ["customers", "projects", "teams", "users", "tasks", "tags", "comments"];
    for (const name of collectionNames) {
      await db.collection(name).deleteMany({});
    }

    // ── customers ────────────────────────────────────────────────
    const customerResult = customers.length
      ? await db.collection("customers").insertMany(customers)
      : { insertedIds: {} };
    const customerIds = customers.map((_, i) => customerResult.insertedIds[i]);

    // ── projects (needs customerIds) ────────────────────────────
    const projectDocs = projects.map((p) => ({
      name: p.name,
      description: p.description,
      customerId: customerIds[p.customerIndex],
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    const projectResult = projectDocs.length
      ? await db.collection("projects").insertMany(projectDocs)
      : { insertedIds: {} };
    const projectIds = projectDocs.map((_, i) => projectResult.insertedIds[i]);

    // ── users (independent, but inserted after projects per required order) ─
    const userResult = users.length
      ? await db.collection("users").insertMany(users)
      : { insertedIds: {} };
    const userIds = users.map((_, i) => userResult.insertedIds[i]);

    // ── teams (needs projectIds + userIds) ──────────────────────
    const teamDocs = teams.map((t) => ({
      name: t.name,
      projectId: projectIds[t.projectIndex],
      memberUserIds: t.memberUserIndexes.map((idx) => userIds[idx]),
      createdAt: t.createdAt,
    }));
    if (teamDocs.length) await db.collection("teams").insertMany(teamDocs);

    // ── tags (independent) ───────────────────────────────────────
    const tagResult = tagPool.length
      ? await db.collection("tags").insertMany(tagPool)
      : { insertedIds: {} };
    const tagIds = tagPool.map((_, i) => tagResult.insertedIds[i]);

    // ── tasks (needs projectIds + userIds + tagIds) ─────────────
    const taskDocs = tasks.map((t) => ({
      title: t.title,
      description: t.description,
      projectId: projectIds[t.projectIndex],
      status: t.status,
      assignedUserId: userIds[t.assignedUserIndex],
      tagIds: t.tagIndexes.map((idx) => tagIds[idx]),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
    const taskResult = taskDocs.length
      ? await db.collection("tasks").insertMany(taskDocs)
      : { insertedIds: {} };
    const taskIds = taskDocs.map((_, i) => taskResult.insertedIds[i]);

    // ── comments (needs taskIds + userIds) ──────────────────────
    const commentDocs = comments.map((c) => ({
      text: c.text,
      taskId: taskIds[c.taskIndex],
      userId: userIds[c.userIndex],
      createdAt: c.createdAt,
    }));
    if (commentDocs.length) await db.collection("comments").insertMany(commentDocs);

    console.log("Seed complete:");
    console.log(`  customers: ${customerIds.length}`);
    console.log(`  projects:  ${projectIds.length}`);
    console.log(`  teams:     ${teamDocs.length}`);
    console.log(`  users:     ${userIds.length}`);
    console.log(`  tasks:     ${taskIds.length}`);
    console.log(`  tags:      ${tagIds.length}`);
    console.log(`  comments:  ${commentDocs.length}`);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seed;
