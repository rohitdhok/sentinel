const pool = require("./db")
const limit = 10

async function getAllAlerts(page) {
    const offset = (page - 1) * limit
    return (await pool.query("SELECT * FROM alerts ORDER BY first_event DESC OFFSET $1 LIMIT $2", [offset, limit])).rows
}

async function getAlertsByUsername(username, page) {
    const offset = (page - 1 ) * limit
    return (await pool.query("SELECT * FROM alerts WHERE username = $1 ORDER BY first_event OFFSET $2 LIMIT $3", [username, offset, limit])).rows
}

async function getAlertsBySeverity(severity, page) {
    const offset = (page - 1 ) * limit
    return (await pool.query("SELECT * FROM alerts WHERE severity = $1 ORDER BY first_event OFFSET $2 LIMIT $3", [severity, offset, limit])).rows
}

async function getAlertsStats() {
    const total_alerts =  Number((await pool.query("SELECT COUNT(*) FROM alerts")).rows[0].count)
    const high_alerts = Number((await pool.query("SELECT COUNT(*) FROM alerts WHERE severity = 'high'")).rows[0].count)
    const critical_alerts = Number((await pool.query("SELECT COUNT(*) FROM alerts WHERE severity IN ('very high', 'critical')")).rows[0].count)
    const recent_alerts = (await pool.query("SELECT * FROM alerts ORDER BY first_event DESC LIMIT 5")).rows

    return {total_alerts, high_alerts, critical_alerts, recent_alerts}
}

async function getTotalAlertsCount() {
    return (await pool.query("SELECT COUNT(*) FROM alerts")).rows[0].count
}

async function getUsers() {
    return (await pool.query("SELECT DISTINCT username FROM alerts WHERE username IS NOT NULL ORDER BY username")).rows
}

async function getAlertsByFilters(severity, username, page) {
    const offset = (page - 1) * limit
    return (await pool.query("SELECT * FROM alerts WHERE severity = $1 AND username = $2 ORDER BY first_event OFFSET $3 LIMIT $4", [severity, username, offset, limit])).rows
}

async function getFilteredAlertsCount(severity, username) {
    return Number(( await pool.query("SELECT COUNT(*) FROM alerts WHERE ($1::text IS NULL OR severity = $1) AND ($2::text IS NULL OR username = $2);", [severity, username])).rows[0].count)
}

module.exports = {getAllAlerts, getAlertsByUsername, getAlertsBySeverity, getAlertsStats, getUsers, getAlertsByFilters, getTotalAlertsCount, getFilteredAlertsCount}