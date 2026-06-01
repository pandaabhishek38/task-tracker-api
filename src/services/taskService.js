const prisma = require("../config/prisma");
const redisClient = require("../config/redis");

const { invalidateAssigneeCache } = require("../utils/cache");

const createTask = async (data) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId,
      organizationId: data.organizationId,
      createdById: data.createdById,
    },
  });

  await invalidateAssigneeCache(task.assigneeId);

  return task;
};

const getTasks = async (organizationId, filters) => {
  const page = Number(filters.page) || 1;

  const limit = Number(filters.limit) || 10;

  const skip = (page - 1) * limit;

  const where = {
    organizationId,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.assigneeId) {
    where.assigneeId = Number(filters.assigneeId);
  }

  // Cache only per assignee
  if (filters.assigneeId) {
    const cacheKey = `tasks:assignee:${filters.assigneeId}:page:${page}:limit:${limit}`;

    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      console.log("Cache HIT:", cacheKey);

      return JSON.parse(cachedTasks);
    }

    console.log("Cache MISS:", cacheKey);

    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));

    return tasks;
  }

  return prisma.task.findMany({
    where,
    skip,
    take: limit,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const getTaskById = async (taskId, organizationId) => {
  return prisma.task.findFirst({
    where: {
      id: Number(taskId),
      organizationId,
    },
  });
};

const updateTask = async (taskId, data, organizationId, currentUser) => {
  const task = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
      organizationId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (data.status && data.status !== task.status) {
    const isAdmin = currentUser.role === "ADMIN";

    const isManager = currentUser.role === "MANAGER";

    const isAssignee = task.assigneeId === currentUser.userId;

    if (!isAdmin && !isManager && !isAssignee) {
      throw new Error(
        "Only the assignee, manager, or admin can change task status"
      );
    }
    const transitions = {
      TODO: ["IN_PROGRESS", "BLOCKED"],

      IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],

      BLOCKED: ["IN_PROGRESS"],

      IN_REVIEW: ["DONE", "IN_PROGRESS", "BLOCKED"],

      DONE: [],
    };

    const allowed = transitions[task.status];

    if (!allowed.includes(data.status)) {
      throw new Error(
        `Invalid status transition from ${task.status} to ${data.status}`
      );
    }
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data,
  });

  await invalidateAssigneeCache(updatedTask.assigneeId);

  return updatedTask;
};

const deleteTask = async (taskId, organizationId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
      organizationId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const deletedTask = await prisma.task.delete({
    where: {
      id: Number(taskId),
    },
  });

  await invalidateAssigneeCache(task.assigneeId);

  return deletedTask;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
