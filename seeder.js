const MongoClient = require("mongodb").MongoClient;
const { faker } = require("@faker-js/faker"); // Ensure the correct import
const url = "mongodb://localhost:27017";
const dbName = "taskManager";

async function seedDB() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

  // Seed Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    // Create 10 users
    users.push({
      name: faker.person.fullName(), // Updated to use faker.person.fullName()
      password: faker.internet.password(),
      email: faker.internet.email(),
      profileImage: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  const userInsertResult = await db.collection("Users").insertMany(users);
  console.log(`${userInsertResult.insertedCount} users seeded successfully!`);

  // Seed Projects
  const projects = [];
  for (let i = 0; i < 5; i++) {
    // Create 5 projects
    projects.push({
      userId:
        userInsertResult.insertedIds[
          Math.floor(Math.random() * userInsertResult.insertedCount)
        ],
      projectName: `Project ${i + 1}`,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [], // Initially, no tasks are linked
    });
  }
  const projectInsertResult = await db
    .collection("Projects")
    .insertMany(projects);
  console.log(
    `${projectInsertResult.insertedCount} projects seeded successfully!`
  );

  // Seed Tasks
  const tasks = [];
  for (let i = 0; i < 20; i++) {
    // Create 20 tasks
    const randomProjectId =
      projectInsertResult.insertedIds[
        Math.floor(Math.random() * projectInsertResult.insertedCount)
      ];
    tasks.push({
      userId: users[Math.floor(Math.random() * users.length)]._id,
      projectId: randomProjectId,
      taskName: faker.lorem.words(3),
      dueDate: faker.date.future(),
      time: faker.date.recent().toTimeString().split(" ")[0],
      createdAt: new Date(),
      priority: ["critical", "high", "low"][Math.floor(Math.random() * 3)],
      status: ["to do", "in progress", "done"][Math.floor(Math.random() * 3)],
      updatedAt: new Date(),
    });
  }
  const taskInsertResult = await db.collection("Tasks").insertMany(tasks);
  console.log(`${taskInsertResult.insertedCount} tasks seeded successfully!`);

  client.close();
}

seedDB().catch(console.error);
