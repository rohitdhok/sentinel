const pool = require("./db")

async function getUserOverview(username) {
    const query = `
        SELECT
            (SELECT COUNT(*)
             FROM events
             WHERE username = $1) AS total_events,

            (SELECT COUNT(*)
             FROM alerts
             WHERE username = $1) AS total_alerts,

            (SELECT MAX(timestamp)
             FROM events
             WHERE username = $1) AS last_activity,

            (SELECT COUNT(*)
             FROM events
             WHERE username = $1
             AND event_type = 'session_opened'
             AND message LIKE '%gdm-password%') AS login_count
    `;

    const result = await pool.query(query, [username]);

    return result.rows[0];
}

async function getUserEventDistribution(username) {
    return ( await pool.query("SELECT event_type, COUNT(*) AS total FROM events WHERE username=$1 GROUP BY event_type ORDER BY total DESC", [username]) ).rows.map((row) => ({...row, total: Number(row.total)}))
}

async function getUserAlertDistribution(username) {
    return ( await pool.query("SELECT alert_type, COUNT(*) AS total FROM alerts WHERE username=$1 GROUP BY alert_type ORDER BY total DESC", [username])).rows.map((row) => ({...row, total: Number(row.total)}))
}

async function getUserSeverityDistribution(username) {
    return ( await pool.query("SELECT severity, COUNT(*) AS total FROM alerts WHERE username=$1 GROUP BY severity ORDER BY total", [username]) ).rows.map((row) => ({...row, total: Number(row.total)}));
}

async function getUserLoginHistory(username) {
    return ( await pool.query("SELECT timestamp, service FROM events WHERE username=$1 AND service='gdm-password]:' AND event_type='session_opened' ORDER BY timestamp DESC LIMIT 5", [username]) ).rows
}

module.exports = { getUserOverview, getUserEventDistribution, getUserAlertDistribution, getUserSeverityDistribution, getUserLoginHistory };

