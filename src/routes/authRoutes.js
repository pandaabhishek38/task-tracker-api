const express = require("express");

const router = express.Router();

const validate = require("../middleware/validation");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const { register, login, refresh } = require("../controllers/authController");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (ADMIN / MANAGER / MEMBER)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *               - organizationId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MANAGER
 *                   - MEMBER
 *               organizationId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post("/register", registerValidation, validate, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and obtain JWT tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

router.post("/login", loginValidation, validate, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access and refresh tokens returned
 */

router.post("/refresh", refresh);

module.exports = router;
