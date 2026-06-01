const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const { getTaskAnalytics } = require("../controllers/analyticsController");

/**
 * @swagger
 * /analytics/tasks:
 *   get:
 *     summary: Task analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics returned successfully
 */

router.get("/tasks", authenticate, getTaskAnalytics);

module.exports = router;
