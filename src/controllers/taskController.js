const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      organizationId: req.user.organizationId,
      createdById: req.user.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(
      req.user.organizationId,
      req.query
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.organizationId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.organizationId,
      req.user
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.organizationId);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
