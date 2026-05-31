const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const authorize = require("../middleware/authorize");

router.get("/admin", authenticate, authorize(["ADMIN"]), (req, res) => {
  res.json({
    message: "Admin access granted",
  });
});

router.get(
  "/manager",
  authenticate,
  authorize(["ADMIN", "MANAGER"]),
  (req, res) => {
    res.json({
      message: "Manager access granted",
    });
  }
);

router.get(
  "/member",
  authenticate,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  (req, res) => {
    res.json({
      message: "Member access granted",
    });
  }
);

module.exports = router;
