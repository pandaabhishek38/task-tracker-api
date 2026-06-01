const redisClient = require("../src/config/redis");

beforeAll(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
});
