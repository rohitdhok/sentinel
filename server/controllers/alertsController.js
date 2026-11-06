const {getAllAlerts, getAlertsByUsername, getAlertsBySeverity, getAlertsStats, getUsers, getAlertsByFilters, getTotalAlertsCount, getFilteredAlertsCount, getAlertsSeverityDistribution} = require("../helpers/alertHelpers");
const { getPage } = require("../helpers/generalUtility");

const limit = 10
const severities = ["high", "very high", "critical"]

async function handleGetAllAlerts(req, res, next) {
    try {
        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const alerts = await getAllAlerts(page);
        const totalAlerts = Number(await getTotalAlertsCount());
        const totalPages = Math.ceil(totalAlerts / limit)

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch (e) {
        return next(e);
    }  
}

async function handleGetAlertsByUsername(req, res, next) {
    try {
        const username = req.params.username;

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalAlerts = await getFilteredAlertsCount(null, username)
        const totalPages = Math.ceil(totalAlerts / limit)

        const alerts = await getAlertsByUsername(username, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch(e) {
        return next(e);
    }
}

async function handleGetAlertsBySeverity(req, res, next) {
    try {
        const severity = req.params.severity;

        if (!severities.includes(severity)) { return res.status(400).json({ message: "invalid severity level" })}

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalAlerts = await getFilteredAlertsCount(severity, null)
        const totalPages = Math.ceil(totalAlerts / limit)

        const alerts = await getAlertsBySeverity(severity, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch(e) {
        return next(e);
    }
}

async function handleGetAlertsStats(req, res, next) {
    try {
        const {total_alerts, high_alerts, critical_alerts, recent_alerts} = await getAlertsStats();
        return res.json({total_alerts, high_alerts, critical_alerts, recent_alerts});
    } catch(e) {
        return next(e);
    }
}

async function handleGetUsers(req, res, next) {
    try {
        const users = await getUsers();
        return res.json({users})
    } catch(e) {
        return next(e);
    }
}

async function handleGetAlertsByFilter(req, res, next) {
    try {
        const severity = req.query.severity
        const username = req.query.username

        if (!severities.includes(severity)) { return res.status(400).json({ message: "invalid severity level" })}

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalAlerts = await getFilteredAlertsCount(severity, username)
        const totalPages = Math.ceil(totalAlerts / limit);

        const alerts = await getAlertsByFilters(severity, username, page);

        return res.json({alerts, totalAlerts, currentPage: page, totalPages})
    } catch(e) {
        return next(e);
    }
}

async function handleGetAlertsSeverityDistribution(req, res, next) {
    try {
        const severityDistribution = await getAlertsSeverityDistribution();

        return res.json({severityDistribution})
    } catch(e) {
        return next(e);
    }
}

module.exports = {handleGetAllAlerts, handleGetAlertsByUsername, handleGetAlertsBySeverity,
    handleGetAlertsStats, handleGetUsers, handleGetAlertsByFilter,
    handleGetAlertsSeverityDistribution}