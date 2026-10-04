const router = require("express").Router();

const {handleGetAllAlerts, handleGetAlertsByUsername, handleGetAlertsBySeverity, handleGetAlertsStats} = require("../controllers/alertsController")

router.get("/user/:username", handleGetAlertsByUsername);
router.get("/severity/:severity", handleGetAlertsBySeverity);
router.get("/stats", handleGetAlertsStats)
router.get("/", handleGetAllAlerts);

module.exports = router;