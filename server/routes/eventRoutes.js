const router = require("express").Router();
const {handleGetAllEvents, handleGetEventsByUsername, handleGetEventsByType, handleGetEventsByFilter} = require("../controllers/eventsControllers");

router.get("/user/:username", handleGetEventsByUsername);
router.get("/type/:type", handleGetEventsByType);
router.get("/filter", handleGetEventsByFilter)
router.get("/", handleGetAllEvents);

module.exports = router