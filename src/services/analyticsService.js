const prisma = require("../config/prisma");

const getTaskAnalytics = async () => {
  const now = new Date();

  const overdueTasks = await prisma.task.groupBy({
    by: ["assigneeId"],
    where: {
      dueDate: {
        lt: now,
      },
      status: {
        not: "DONE",
      },
      assigneeId: {
        not: null,
      },
    },
    _count: {
      id: true,
    },
  });

  const overdueTasksPerUser = await Promise.all(
    overdueTasks.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: {
          id: entry.assigneeId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        userId: user.id,
        name: user.name,
        count: entry._count.id,
      };
    })
  );

  const completedTasks = await prisma.task.findMany({
    where: {
      status: "DONE",
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  let averageCompletionTimeDays = 0;

  if (completedTasks.length > 0) {
    const totalDays = completedTasks.reduce((sum, task) => {
      const diffMs = task.updatedAt - task.createdAt;

      return sum + diffMs / (1000 * 60 * 60 * 24);
    }, 0);

    averageCompletionTimeDays = totalDays / completedTasks.length;
  }

  return {
    overdueTasksPerUser,
    averageCompletionTimeDays: Number(averageCompletionTimeDays.toFixed(2)),
  };
};

module.exports = {
  getTaskAnalytics,
};
