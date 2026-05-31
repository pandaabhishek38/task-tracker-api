require("dotenv").config();

const app = require("./src/app");

const redisClient = require("./src/config/redis");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await redisClient.connect();

  console.log("Redis connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
