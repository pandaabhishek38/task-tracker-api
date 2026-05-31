const express = require("express");

const router = express.Router();

const validate = require("../middleware/validation");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const { register, login, refresh } = require("../controllers/authController");

router.post("/register", registerValidation, validate, register);

router.post("/login", loginValidation, validate, login);

router.post("/refresh", refresh);

module.exports = router;
