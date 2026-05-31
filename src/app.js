const express = require("express");

const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");

const authRoutes = require("./routes/authRoutes");

const testRoutes = require("./routes/testRoutes");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);

app.use("/test", testRoutes);

app.use("/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;
