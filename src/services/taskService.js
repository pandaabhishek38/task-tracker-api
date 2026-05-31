const prisma = require("../config/prisma");

const createTask = async (data) => {
  return prisma.task.create({
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
      TODO: ["IN_PROGRESS"],

      IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],

      BLOCKED: ["IN_PROGRESS"],

      IN_REVIEW: ["DONE", "IN_PROGRESS"],

      DONE: [],
    };

    const allowed = transitions[task.status];

    if (!allowed.includes(data.status)) {
      throw new Error(
        `Invalid status transition from ${task.status} to ${data.status}`
      );
    }
  }

  return prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data,
  });
};

const deleteTask = async (taskId) => {
  return prisma.task.delete({
    where: {
      id: Number(taskId),
    },
  });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
