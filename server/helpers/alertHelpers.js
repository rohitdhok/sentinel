const pool = require("./db")

async function getAllAlerts() {
    return (await pool.query("SELECT * FROM alerts ORDER BY first_event DESC")).rows
}

async function getAlertsByUsername(username) {
    return (await pool.query("SELECT * FROM alerts WHERE username = $1", [username])).rows
}

async function getAlertsBySeverity(severity) {
    return (await pool.query("SELECT * FROM alerts WHERE severity = $1", [severity])).rows
}

async function getAlertsStats() {
    const total_alerts =  Number((await pool.query("SELECT COUNT(*) FROM alerts")).rows[0].count)
    const high_alerts = Number((await pool.query("SELECT COUNT(*) FROM alerts WHERE severity = 'high'")).rows[0].count)
    const critical_alerts = Number((await pool.query("SELECT COUNT(*) FROM alerts WHERE severity IN ('very high', 'critical')")).rows[0].count)
    const recent_alerts = (await pool.query("SELECT * FROM alerts ORDER BY first_event DESC LIMIT 5")).rows

    return {total_alerts, high_alerts, critical_alerts, recent_alerts}
}

async function getUsers() {
    return (await pool.query("SELECT DISTINCT username FROM alerts WHERE username IS NOT NULL ORDER BY username")).rows
}

async function getAlertsByFilters(severity, username) {
    return (await pool.query("SELECT * FROM alerts WHERE severity = $1 AND username = $2", [severity, username])).rows
}

module.exports = {getAllAlerts, getAlertsByUsername, getAlertsBySeverity, getAlertsStats, getUsers, getAlertsByFilters}