const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Task Tracker API",

      version: "1.0.0",

      description:
        "Team-based task tracker API with JWT authentication, RBAC, Redis caching, and Docker support",
    },

    tags: [
      {
        name: "Authentication",
        description: "User registration, login and token refresh",
      },
      {
        name: "Tasks",
        description: "Task management operations",
      },
    ],

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
