const { body } = require("express-validator");

const createTaskValidation = [
  body("title").notEmpty().withMessage("title is required"),

  body("priority")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("priority must be LOW, MEDIUM or HIGH"),
];

const updateTaskValidation = [
  body("status")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"])
    .withMessage("invalid status"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("priority must be LOW, MEDIUM or HIGH"),
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
};
