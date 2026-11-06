const { handleGetUserOverview, handleGetUserEventDistribution, handleGetUserAlertDistribution, handleGetUserSeverityDistribution, handleGetUserLoginHistory } = require("../controllers/analyticsController");
const router = require("express").Router();

router.get("/user/:username/overview", handleGetUserOverview)
router.get("/user/:username/event-distribution", handleGetUserEventDistribution)
router.get("/user/:username/alert-distribution", handleGetUserAlertDistribution)
router.get("/user/:username/alert-severity", handleGetUserSeverityDistribution)
router.get("/user/:username/login-history", handleGetUserLoginHistory)

module.exports = router