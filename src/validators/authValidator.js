const { body } = require("express-validator");

const registerValidation = [
  body("name").notEmpty().withMessage("name is required"),

  body("email").isEmail().withMessage("valid email is required"),

  body("password")
    .isLength({
      min: 8,
    })
    .withMessage("password must be at least 8 characters"),

  body("role")
    .isIn(["ADMIN", "MANAGER", "MEMBER"])
    .withMessage("role must be ADMIN, MANAGER or MEMBER"),

  body("organizationId").isInt().withMessage("organizationId is required"),
];

const loginValidation = [
  body("email").isEmail().withMessage("valid email is required"),

  body("password").notEmpty().withMessage("password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};
