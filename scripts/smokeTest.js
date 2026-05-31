const BASE_URL = "http://localhost:3000";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoxLCJpYXQiOjE3ODAyMzE5NjYsImV4cCI6MTc4MDIzMjg2Nn0._-g8KsY0EsigaC2tHSSx6V59ysF2MB9WmCcaEOJDksQ";

async function request(method, url, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);

  const data = await response.json();

  console.log(`\n${method} ${url}`);

  console.log("Status:", response.status);

  console.log(data);

  return data;
}

async function run() {
  console.log("\n=== CREATE TASK ===");

  const task = await request("POST", "/tasks", {
    title: "Smoke Test Task",
    description: "Created by smoke test",
    priority: "HIGH",
    assigneeId: 1,
  });

  const taskId = task.id;

  console.log("\n=== GET TASK ===");

  await request("GET", `/tasks/${taskId}`);

  console.log("\n=== PAGINATION ===");

  await request("GET", "/tasks?page=1&limit=2");

  console.log("\n=== PRIORITY FILTER ===");

  await request("GET", "/tasks?priority=HIGH");

  console.log("\n=== STATUS FILTER ===");

  await request("GET", "/tasks?status=TODO");

  console.log("\n=== ASSIGNEE FILTER ===");

  await request("GET", "/tasks?assigneeId=1");

  console.log("\n=== VALID TRANSITION ===");

  await request("PATCH", `/tasks/${taskId}`, {
    status: "IN_PROGRESS",
  });

  console.log("\n=== INVALID TRANSITION ===");

  await request("PATCH", `/tasks/${taskId}`, {
    status: "DONE",
  });
}

run();
