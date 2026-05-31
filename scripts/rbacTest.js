const BASE_URL = "http://localhost:3000";

const MANAGER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJNQU5BR0VSIiwib3JnYW5pemF0aW9uSWQiOjEsImlhdCI6MTc4MDIzMjMxNywiZXhwIjoxNzgwMjMzMjE3fQ._JLsiW_x0j6S_jv60k0qUZ2sQSQ6bh_eqXfPlVtKj0o";

const MEMBER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJNRU1CRVIiLCJvcmdhbml6YXRpb25JZCI6MSwiaWF0IjoxNzgwMjMyMzYwLCJleHAiOjE3ODAyMzMyNjB9.mYSz7leUqOclrvjtzO6qrcEv7UQ_GdSNStee3Ts1pQI";

async function request(method, url, token, body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
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
  console.log("\n=== MANAGER CREATE TASK ===");

  await request("POST", "/tasks", MANAGER_TOKEN, {
    title: "Manager Task",
    priority: "MEDIUM",
    assigneeId: 1,
  });

  console.log("\n=== MEMBER CREATE TASK ===");

  await request("POST", "/tasks", MEMBER_TOKEN, {
    title: "Member Task",
    priority: "LOW",
    assigneeId: 1,
  });
}

run();
