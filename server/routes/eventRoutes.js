const router = require("express").Router();
const {handleGetAllEvents, handleGetEventsByUsername, handleGetEventsByType, handleGetEventsByFilter, handleGetEventsDistribution, handleGetEventActivity} = require("../controllers/eventsControllers");

router.get("/user/:username", handleGetEventsByUsername);
router.get("/type/:type", handleGetEventsByType);
router.get("/filter", handleGetEventsByFilter);
router.get("/analytics", handleGetEventsDistribution)
router.get("/activity", handleGetEventActivity)
router.get("/", handleGetAllEvents);

module.exports = router