const BASE_URL = "http://localhost:3000";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoxLCJpYXQiOjE3ODAyMzUzMzQsImV4cCI6MTc4MDIzNjIzNH0.s3V-YYTld3k4I1utU4s1kj1GDBCaCjAX5Ay6wWKt8uY";

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
  console.log("\n=== FIRST GET (MISS EXPECTED) ===");

  await request("GET", "/tasks?assigneeId=1");

  console.log("\n=== SECOND GET (HIT EXPECTED) ===");

  await request("GET", "/tasks?assigneeId=1");

  console.log("\n=== CREATE TASK (INVALIDATE CACHE) ===");

  await request("POST", "/tasks", {
    title: "Redis Cache Test",
    description: "Testing cache invalidation",
    priority: "HIGH",
    assigneeId: 1,
  });

  console.log("\n=== THIRD GET (MISS EXPECTED AFTER INVALIDATION) ===");

  await request("GET", "/tasks?assigneeId=1");

  console.log("\n=== FOURTH GET (HIT EXPECTED AGAIN) ===");

  await request("GET", "/tasks?assigneeId=1");

  console.log("\n=== REDIS TEST COMPLETE ===");
}

run();
