const analyticsService = require("../services/analyticsService");

const getTaskAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getTaskAnalytics();

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTaskAnalytics,
};
