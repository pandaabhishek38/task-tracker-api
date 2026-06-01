const request = require("supertest");
const app = require("../src/app");

describe("Authentication Flow", () => {
  const timestamp = Date.now();

  const userData = {
    name: "Integration Test User",
    email: `integration${timestamp}@test.com`,
    password: "password123",
    role: "MEMBER",
    organizationId: 1,
  };

  test("Register -> Login -> Refresh", async () => {
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginResponse.status).toBe(200);

    expect(loginResponse.body.accessToken).toBeDefined();

    expect(loginResponse.body.refreshToken).toBeDefined();

    const refreshResponse = await request(app).post("/auth/refresh").send({
      refreshToken: loginResponse.body.refreshToken,
    });

    expect(refreshResponse.status).toBe(200);

    expect(refreshResponse.body.accessToken).toBeDefined();

    expect(refreshResponse.body.refreshToken).toBeDefined();
  });
});
