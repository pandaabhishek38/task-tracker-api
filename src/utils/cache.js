const redisClient = require("../config/redis");

const invalidateAssigneeCache = async (assigneeId) => {
  if (!assigneeId) {
    return;
  }

  const cacheKey = `tasks:assignee:${assigneeId}`;

  await redisClient.del(cacheKey);

  console.log("Cache invalidated:", cacheKey);
};

module.exports = {
  invalidateAssigneeCache,
};
