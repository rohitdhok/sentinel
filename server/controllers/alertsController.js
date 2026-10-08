const {getAllAlerts, getAlertsByUsername, getAlertsBySeverity, getAlertsStats, getUsers, getAlertsByFilters} = require("../helpers/alertHelpers")

async function handleGetAllAlerts(req, res) {
    try {
        const alerts = await getAllAlerts();

        return res.json({alerts})
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }  
}

async function handleGetAlertsByUsername(req, res) {
    try {
        const username = req.params.username;
        const alerts = await getAlertsByUsername(username);

        return res.json({alerts})
    } catch(e) {
        res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

async function handleGetAlertsBySeverity(req, res) {
    try {
        const severity = req.params.severity;
        const alerts = await getAlertsBySeverity(severity);

        return res.json({alerts})
    } catch(e) {
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
}

async function handleGetAlertsStats(req, res) {
    try {
        const {total_alerts, high_alerts, critical_alerts, recent_alerts} = await getAlertsStats();
        return res.json({total_alerts, high_alerts, critical_alerts, recent_alerts});
    } catch(e) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function handleGetUsers(req, res) {
    try {
        const users = await getUsers();
        return res.json({users})
    } catch {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function handleGetAlertsByFilter(req, res) {
    try {
        const severity = req.query.severity
        const username = req.query.username
        const alerts = await getAlertsByFilters(severity, username);

        return res.json({alerts})
    } catch {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {handleGetAllAlerts, handleGetAlertsByUsername, handleGetAlertsBySeverity, handleGetAlertsStats, handleGetUsers, handleGetAlertsByFilter}