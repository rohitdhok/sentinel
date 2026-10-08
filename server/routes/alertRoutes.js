const router = require("express").Router();

const {handleGetAllAlerts, handleGetAlertsByUsername, handleGetAlertsBySeverity, handleGetAlertsStats, handleGetUsers, handleGetAlertsByFilter} = require("../controllers/alertsController")

router.get("/user/:username", handleGetAlertsByUsername);
router.get("/severity/:severity", handleGetAlertsBySeverity);
router.get("/stats", handleGetAlertsStats)
router.get("/users", handleGetUsers)
router.get("/filter", handleGetAlertsByFilter)
router.get("/", handleGetAllAlerts);

module.exports = router;