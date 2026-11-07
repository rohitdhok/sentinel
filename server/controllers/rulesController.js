const { getAllRules, toggleRule, updateRule } = require("../helpers/rulesHelper");

const severities = ["high", "very high", "critical"]

async function handleGetAllRules(req, res, next) {
    try {
        const rules = await getAllRules();

        return res.json({rules});
    } catch(e) {
        return next(e);
    }
}

async function handleToggleRule(req, res, next) {
    try {
        const id = req.params.id;
        const toggled = await toggleRule(id);

        if (!toggled) {return res.status(404).json({ message: "rule not found." })}

        return res.json({rule: toggled})
    } catch(e) {
        return next(e);
    }
}

async function handleUpdateRule(req, res, next) {
    try {
        const id = req.params.id;
        const {threshold, window_minutes, severity} = req.body;

        if (threshold < 1) { return res.status(400).json({ message: "invalid threshold value." }) }
        if (window_minutes < 1) { return res.status(400).json({ message: "invalid window minutes value." }) }
        if (!severities.includes(severity)) { return res.status(400).json({ message: "invalid severity level." }) }

        const values = {threshold, window_minutes, severity}
        const rule = await updateRule(id, values)

        return res.json({rule});
    } catch(e) {
        return next(e);
    }
}

module.exports = { handleGetAllRules, handleToggleRule, handleUpdateRule }