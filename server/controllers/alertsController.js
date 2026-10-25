const {getAllAlerts, getAlertsByUsername, getAlertsBySeverity, getAlertsStats, getUsers, getAlertsByFilters, getTotalAlertsCount, getFilteredAlertsCount} = require("../helpers/alertHelpers")
const limit = 10


async function handleGetAllAlerts(req, res) {
    try {
        const page = Number(req.query.page);
        const alerts = await getAllAlerts(page);
        const totalAlerts = Number(await getTotalAlertsCount());
        const totalPages = Math.ceil(totalAlerts / limit)

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }  
}

async function handleGetAlertsByUsername(req, res) {
    try {
        const username = req.params.username;

        const page = Number(req.query.page)
        const totalAlerts = await getFilteredAlertsCount(null, username)
        const totalPages = Math.ceil(totalAlerts / limit)

        const alerts = await getAlertsByUsername(username, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch(e) {
        res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

async function handleGetAlertsBySeverity(req, res) {
    try {
        const severity = req.params.severity;

        const page = Number(req.query.page)
        const totalAlerts = await getFilteredAlertsCount(severity, null)
        const totalPages = Math.ceil(totalAlerts / limit)

        const alerts = await getAlertsBySeverity(severity, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
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

        const page = Number(req.query.page)
        const totalAlerts = await getFilteredAlertsCount(severity, username)
        const totalPages = Math.ceil(totalAlerts / limit);

        const alerts = await getAlertsByFilters(severity, username, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {handleGetAllAlerts, handleGetAlertsByUsername, handleGetAlertsBySeverity, handleGetAlertsStats, handleGetUsers, handleGetAlertsByFilter}