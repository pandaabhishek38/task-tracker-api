const express = require("express");

const router = express.Router();

const validate = require("../middleware/validation");

const {
  createTaskValidation,
  updateTaskValidation,
} = require("../validators/taskValidator");

const authenticate = require("../middleware/authenticate");

const authorize = require("../middleware/authorize");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task (ADMIN / MANAGER only)
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priority
 *               - assigneeId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *               assigneeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 */

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "MANAGER"]),
  createTaskValidation,
  validate,
  createTask
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks (Authenticated users)
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         description: Filter by task status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         description: Filter by task priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: assigneeId
 *         description: Filter by assignee
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Page size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 */

router.get("/", authenticate, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task details by ID
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found
 */

router.get("/:id", authenticate, getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task and perform status transitions
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                     - TODO
 *                     - IN_PROGRESS
 *                     - IN_REVIEW
 *                     - DONE
 *                     - BLOCKED
 *     responses:
 *       200:
 *         description: Task updated successfully
 */

router.patch("/:id", authenticate, updateTaskValidation, validate, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task (ADMIN only)
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */

router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteTask);

module.exports = router;
