const { handleGetAllRules, handleToggleRule, handleUpdateRule } = require("../controllers/rulesController");

const router = require("express").Router();

router.patch("/:id/toggle", handleToggleRule)
router.patch("/update/:id", handleUpdateRule)
router.get("/", handleGetAllRules);

module.exports = router