const request = require("supertest");
const app = require("../src/app");

describe("Task Workflow", () => {
  let accessToken;
  let taskId;

  beforeAll(async () => {
    const timestamp = Date.now();

    const email = `taskflow${timestamp}@test.com`;

    await request(app).post("/auth/register").send({
      name: "Task Flow User",
      email,
      password: "password123",
      role: "ADMIN",
      organizationId: 1,
    });

    const loginResponse = await request(app).post("/auth/login").send({
      email,
      password: "password123",
    });

    accessToken = loginResponse.body.accessToken;
  });

  test("Create task and complete workflow", async () => {
    const createResponse = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Integration Task",
        priority: "HIGH",
        assigneeId: 1,
      });

    expect(createResponse.status).toBe(201);

    taskId = createResponse.body.id;

    expect(taskId).toBeDefined();

    const inProgress = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: "IN_PROGRESS",
      });

    expect(inProgress.status).toBe(200);

    const inReview = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: "IN_REVIEW",
      });

    expect(inReview.status).toBe(200);

    const done = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: "DONE",
      });

    expect(done.status).toBe(200);
  });

  test("Reject invalid transition", async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: "TODO",
      });

    expect(response.status).toBe(500);

    expect(response.body.message).toContain("Invalid status transition");
  });
});
