const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const authorize = require("../middleware/authorize");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", authenticate, authorize(["ADMIN", "MANAGER"]), createTask);

router.get("/", authenticate, getTasks);

router.get("/:id", authenticate, getTaskById);

router.patch("/:id", authenticate, updateTask);

router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteTask);

module.exports = router;
